import { UserCon } from "./userCon";

export class Consultor extends UserCon{
  userId:number;
  spe_id:number;
  speDescription: string;
  
  status: string;
  statusDescription:string;
  createdUser:string;
  lastUpdatedUser:string;
  createdTime:Date;
  lastUpdatedTime:Date;

  pageSize:number;
  pageNumber:number;

  activeUserName:string;
}
