ALTER TABLE auctions
ADD CONSTRAINT unique_item_auction UNIQUE (item_id);