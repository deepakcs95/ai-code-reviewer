"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog.tsx";
import { Input } from "../../../components/ui/input.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { useProject } from "../../../hooks/use-project.tsx";

export default function InviteMembers() {
  const { projectId } = useProject();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Members</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500">Invite team members to your project</p>
          <Input
            className="mt-4"
            readOnly
            onClick={() =>
              navigator.clipboard.writeText(`${window.location.origin}/invite/${projectId}`)
            }
            value={`${window.location.origin}/invite/${projectId}`}
          />
        </DialogContent>
      </Dialog>
      <Button size="sm" onClick={() => setOpen(true)}>
        Invite members
      </Button>
    </>
  );
}
