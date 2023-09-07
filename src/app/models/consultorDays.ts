import { SlotDtoList } from "./slotDtoList";

export class ConsultorDays {
  con_id:number;
  slotDtoList:SlotDtoList[];
  
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
