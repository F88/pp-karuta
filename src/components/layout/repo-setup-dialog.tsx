import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getRepositoryState } from '@/lib/repository/promidas-repo';
import { RepoSetup } from './repo-setup';

interface RepoSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  autoCloseOnValid?: boolean;
}

export function RepoSetupDialog({
  open,
  onOpenChange,
  autoCloseOnValid = false,
}: RepoSetupDialogProps) {
  // Monitor repository state and auto-close when valid (if enabled)
  useEffect(() => {
    if (!open || !autoCloseOnValid) return;

    const useDummyData = import.meta.env.VITE_USE_DUMMY_DATA === 'true';
    if (useDummyData) return;

    const intervalId = setInterval(() => {
      const repoState = getRepositoryState();
      console.debug('[RepoSetupDialog] Checking repo state:', repoState);
      if (repoState.type === 'created-token-valid') {
        onOpenChange(false);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [open, autoCloseOnValid, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Setup PROMIDAS Repository</DialogTitle>
          <DialogDescription>
            Configure your PROMIDAS API token to access prototype data.
          </DialogDescription>
        </DialogHeader>
        <RepoSetup />
      </DialogContent>
    </Dialog>
  );
}
