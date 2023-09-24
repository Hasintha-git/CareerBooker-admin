import { UserCon } from "./userCon";

export class Consultor extends UserCon{
  con_id: number;
  userId:number;
  spe_id:number;
  speDescription: string;
  
  status: string;
  statusDescription:string;
  createdUser:string;
  lastUpdatedUser:string;
  createdTime:Date;
  lastUpdatedTime:Date;

  userRole: string;
  userRoleDescription: string;

  pageSize:number;
  pageNumber:number;

  activeUserName:string;
}
