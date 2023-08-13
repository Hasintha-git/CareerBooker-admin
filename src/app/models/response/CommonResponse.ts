export class CommonResponse {
    status: string;
    msg: string;
    data: MyObject;
  }
  interface MyObject {
    total_employee_count: string;
    turnover_true_emp_count: string;
    turnover_true_A_rated_emp_count: string;
    highest_turnover_rate_department: string;
    year: any;
    month_name:any;
  }