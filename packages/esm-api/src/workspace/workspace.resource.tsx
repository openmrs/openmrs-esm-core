import { Subject, Observable } from "rxjs";

const workspaceItem = new Subject<WorkspaceItem>();

export function newWorkspaceItem(item: WorkspaceItem) {
  workspaceItem.next(item);
}

export function getNewWorkspaceItem(): Observable<WorkspaceItem> {
  return workspaceItem.asObservable();
}

export interface WorkspaceItem {
  component: any;
  name: string;
  props: any;
  validations?: Function;
  inProgress: boolean;
  componentClosed?: Function;
}
