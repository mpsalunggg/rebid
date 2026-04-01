'use client'

import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { openDialog, closeDialog } from '@/store/dialog.slice'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PlusIcon, PackageIcon } from 'lucide-react'
import type { Item } from '@/features/item/item.type'
import ItemCard from '@/features/item/components/ItemCard'
import ItemDetailDialog from '@/features/item/components/ItemDetailDialog'
import CreateItemDialog from '@/features/item/components/CreateItemDialog'
import EditItemDialog from '@/features/item/components/EditItemDialog'
import DeleteItemDialog from '@/features/item/components/DeleteItemDialog'
import AppDialog from '@/components/common/AppDialog'
import { useGetAllQuery, useDeleteItemMutation } from '@/features/item/item.api'
import PaginationCustom from '@/components/common/PaginationCustom'

const mockItems: Item[] = [
  {
    id: '1',
    user_id: 'u1',
    name: 'Vintage Camera',
    description:
      'A classic 35mm film camera from the 1970s, fully functional with original leather case and strap. Perfect for film photography enthusiasts.',
    images: [],
    created_at: '2026-03-20T10:00:00Z',
    updated_at: '2026-03-25T10:00:00Z',
  },
  {
    id: '2',
    user_id: 'u1',
    name: 'Mechanical Watch',
    description:
      'Swiss-made mechanical watch with sapphire crystal and exhibition caseback. Hand-wound movement, 42-hour power reserve.',
    images: [],
    created_at: '2026-03-18T08:00:00Z',
    updated_at: '',
  },
  {
    id: '3',
    user_id: 'u1',
    name: 'Signed Jersey',
    description:
      'Official match jersey signed by the entire 2024 championship team. Comes with certificate of authenticity.',
    images: [],
    created_at: '2026-03-15T14:00:00Z',
    updated_at: '',
  },
]

export default function ItemsPage() {
  const dispatch = useDispatch()
  const { data: items, isLoading } = useGetAllQuery({ page: 1, limit: 10 })
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation()
  // const [items, setItems] = useState<Item[]>(mockItems);

  // console.log("[ITEMS] - ", items);

  const handleCreate = useCallback(
    (data: { name: string; description: string; images: File[] }) => {
      console.log('[DATA CREATE] - ', data)

      // dispatch(closeDialog());
    },
    [dispatch],
  )

  const handleEdit = useCallback(
    (
      itemId: string,
      data: {
        name: string
        description: string
        keepImageIds: string[]
        newImages: File[]
      },
    ) => {
      // setItems((prev) =>
      //   prev.map((item) =>
      //     item.id === itemId
      //       ? {
      //           ...item,
      //           name: data.name,
      //           description: data.description,
      //           images: item.images.filter((img) =>
      //             data.keepImageIds.includes(img.id),
      //           ),
      //           updated_at: new Date().toISOString(),
      //         }
      //       : item,
      //   ),
      // );
      dispatch(closeDialog())
    },
    [dispatch],
  )

  const handleDelete = useCallback(
    (itemId: string) => {
      // setItems((prev) => prev.filter((item) => item.id !== itemId));
      deleteItem({ id: itemId })
      dispatch(closeDialog())
    },
    [dispatch],
  )

  const openView = useCallback(
    (item: Item) => {
      dispatch(
        openDialog({
          id: 'item-view',
          component: <ItemDetailDialog item={item} />,
          maxWidth: 'max-w-lg',
        }),
      )
    },
    [dispatch],
  )

  const openCreate = useCallback(() => {
    dispatch(
      openDialog({
        id: 'item-create',
        component: <CreateItemDialog onSubmit={handleCreate} />,
        maxWidth: 'max-w-lg',
      }),
    )
  }, [dispatch, handleCreate])

  const openEdit = useCallback(
    (item: Item) => {
      dispatch(
        openDialog({
          id: 'item-edit',
          component: (
            <EditItemDialog
              item={item}
              onSubmit={(data) => handleEdit(item.id, data)}
            />
          ),
          maxWidth: 'max-w-lg',
        }),
      )
    },
    [dispatch, handleEdit],
  )

  const openDelete = useCallback(
    (item: Item) => {
      dispatch(
        openDialog({
          id: 'item-delete',
          component: (
            <DeleteItemDialog
              item={item}
              onConfirm={() => handleDelete(item.id)}
            />
          ),
          maxWidth: 'max-w-md',
        }),
      )
    },
    [dispatch, handleDelete],
  )

  return (
    <section className="col-span-12 lg:col-span-9">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">My Items</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {items?.data.records?.length} item
            {items?.data.records?.length !== 1 ? 's' : ''} in your collection
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Item List */}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-muted-foreground">Loading items...</p>
        </div>
      ) : (
        <>
          <Card className="border shadow-none py-0 overflow-hidden">
            {items?.data.records && items?.data.records.length > 0 ? (
              <div className="divide-y">
                {items.data.records.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onView={openView}
                    onEdit={openEdit}
                    onDelete={openDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <PackageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">No items yet</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                  Add your first item to get started. You can then list them for
                  auction.
                </p>
                <Button
                  onClick={openCreate}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Your First Item
                </Button>
              </div>
            )}
          </Card>
          <PaginationCustom
            totalPages={items?.data.meta.totalPages ?? 1}
            currentPage={items?.data.meta.page ?? 1}
            onPageChange={(page) => {
              console.log('Page changed to: ', page)
            }}
          />
        </>
      )}
      <AppDialog />
    </section>
  )
}
