import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.css'],
})
export class TodolistComponent implements OnInit {
  taskArray = [{ id: 1, task: 'Brush teeth', completed: false }];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any>('http://127.0.0.1:8080/api/v1/tasks/').subscribe(data => {
      this.taskArray = data;
    });
  }

  onSubmit(form: NgForm) {
    this.http.post<any>('http://127.0.0.1:8080/api/v1/tasks/',
      {
        "id": 10000,
        "task": form.controls['task'].value,
        "completed": false,
      }
    ).subscribe(data => {
      console.log(data.id)
      this.taskArray.push({
        id: data.id,
        task: data.task,
        completed: data.completed,
      })
    });
    form.reset();
  }

  onDelete(id: number) {
    this.taskArray = this.taskArray.filter(function(item) {
      return item.id !== id
    })
    this.http.delete<any>('http://127.0.0.1:8080/api/v1/tasks/' + id,
      { body: { "id":id } }
    ).subscribe()
  }

  onCheck(id: number, task: string) {
    let mod_index= this.taskArray.findIndex(function(item) {
      return item.id === id
    });

    this.taskArray[mod_index].completed = !this.taskArray[mod_index].completed;
    this.http.put<any>('http://127.0.0.1:8080/api/v1/tasks/' + id,
      {
          "id": id,
          "task": task,
          "completed": this.taskArray[mod_index].completed,
        }
    ).subscribe()
  }

}
