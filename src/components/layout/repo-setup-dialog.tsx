import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RepoSetup } from './repo-setup';

interface RepoSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RepoSetupDialog({ open, onOpenChange }: RepoSetupDialogProps) {
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
