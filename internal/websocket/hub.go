package websocket

import (
	"sync"

	"github.com/google/uuid"
)

type Client struct {
	AuctionID uuid.UUID
	Send      chan []byte
}

type Hub struct {
	mu       sync.RWMutex
	auctions map[uuid.UUID]map[*Client]struct{}
}

func NewHub() *Hub {
	return &Hub{
		auctions: make(map[uuid.UUID]map[*Client]struct{}),
	}
}

func (h *Hub) Register(auctionID uuid.UUID, client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if h.auctions[auctionID] == nil {
		h.auctions[auctionID] = make(map[*Client]struct{})
	}

	h.auctions[auctionID][client] = struct{}{}
}

func (h *Hub) Unregister(auctionID uuid.UUID, client *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	if m, ok := h.auctions[auctionID]; ok {
		delete(m, client)
		close(client.Send)
		if len(m) == 0 {
			delete(h.auctions, auctionID)
		}
	}
}

func (h *Hub) BroadcastToAuction(auctionID uuid.UUID, message []byte) {
	h.mu.RLock()
	clients := make([]*Client, 0, len(h.auctions[auctionID]))

	for c := range h.auctions[auctionID] {
		clients = append(clients, c)
	}

	h.mu.RUnlock()

	for _, c := range clients {
		select {
		case c.Send <- message:
		default:
		}
	}
}
