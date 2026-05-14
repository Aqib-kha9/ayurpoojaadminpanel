import * as React from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteConfirmDialogProps {
  target: { id: string; label: string } | null
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

import { useTranslation } from "react-i18next"

export default function DeleteConfirmDialog({
  target,
  onOpenChange,
  onConfirm
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation()
  return (
    <AlertDialog open={!!target} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("common.delete_confirm") || "Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("categories.delete_desc") || "This action cannot be undone."}
            <br />
            <strong>"{target?.label}"</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl">{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="rounded-xl bg-destructive hover:bg-destructive/90 text-white">
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
