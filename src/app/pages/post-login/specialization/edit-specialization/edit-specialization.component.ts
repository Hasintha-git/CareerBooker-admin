import { Component, OnInit } from '@angular/core';
import { SimpleBase } from 'src/app/models/SimpleBase';

@Component({
  selector: 'app-edit-specialization',
  templateUrl: './edit-specialization.component.html',
  styleUrls: ['./edit-specialization.component.scss']
})
export class EditSpecializationComponent implements OnInit {

  public statusList: SimpleBase[];

  constructor() { }

  ngOnInit(): void {
  }

}
