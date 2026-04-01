'use client'

import { toast } from 'sonner'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { openDialog, closeDialog } from '@/store/dialog.slice'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PlusIcon, PackageIcon } from 'lucide-react'
import type { Item, ItemUpdatePayload } from '@/features/item/item.type'
import ItemCard from '@/features/item/components/ItemCard'
import ItemDetailDialog from '@/features/item/components/ItemDetailDialog'
import CreateItemDialog from '@/features/item/components/CreateItemDialog'
import EditItemDialog from '@/features/item/components/EditItemDialog'
import DeleteItemDialog from '@/features/item/components/DeleteItemDialog'
import AppDialog from '@/components/common/AppDialog'
import {
  useGetAllQuery,
  useDeleteItemMutation,
  useCreateItemMutation,
  useUpdateItemMutation,
} from '@/features/item/item.api'
import { useQueryParams } from '@/hooks/useQueryParams'
import PaginationControl from '@/components/common/PaginationControl'

export default function ItemsPage() {
  const { getParam } = useQueryParams()
  const page = Number.parseInt(getParam('page', '1'), 10)
  const limit = Number.parseInt(getParam('limit', '5'), 10)
  const dispatch = useDispatch()
  const { data: items, isLoading } = useGetAllQuery({ page, limit })
  const [createItem, { isLoading: isCreating }] = useCreateItemMutation()
  const [deleteItem, { isLoading: isDeleting }] = useDeleteItemMutation()
  const [updateItem, { isLoading: isUpdating }] = useUpdateItemMutation()

  const handleCreate = useCallback(
    (data: { name: string; description: string; images: File[] }) => {
      createItem({ data })
        .unwrap()
        .then((response) => {
          toast.success(response.message)
        })
        .catch((error) => {
          toast.error(error.data.message)
        })
        .finally(() => {
          dispatch(closeDialog())
        })
    },
    [dispatch, createItem],
  )

  const handleEdit = useCallback(
    (itemId: string, data: ItemUpdatePayload) => {
      updateItem({ id: itemId, data })
        .unwrap()
        .then((response) => {
          toast.success(response.message)
        })
        .catch((error) => {
          toast.error(error.data.message)
        })
        .finally(() => {
          dispatch(closeDialog())
        })
    },
    [dispatch, updateItem],
  )

  const handleDelete = useCallback(
    (itemId: string) => {
      deleteItem({ id: itemId })
        .unwrap()
        .then((response) => {
          toast.success(response.message)
        })
        .catch((error) => {
          toast.error(error.data.message)
        })
        .finally(() => {
          dispatch(closeDialog())
        })
    },
    [dispatch, deleteItem],
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
        component: (
          <CreateItemDialog onSubmit={handleCreate} isLoading={isCreating} />
        ),
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
              isLoading={isUpdating}
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
              isLoading={isDeleting}
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
        <section className="space-y-4">
          <Card className="border shadow-none py-0 overflow-hidden w-full">
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
          <PaginationControl
            totalPages={items?.data.meta.total_pages}
            currentPage={items?.data.meta.page}
          />
        </section>
      )}
      <AppDialog />
    </section>
  )
}
