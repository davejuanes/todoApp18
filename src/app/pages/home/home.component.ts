import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";

import { Task } from "./../../models/task.model";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasks = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Instalar Angular CLI',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Crear proyecto',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Crear componentes',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Crear servicios',
      completed: false
    },
  ]);
  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByFilter = computed(() => {
    const filter = this.filter();
    const tasks = this.tasks();
    if (filter == 'pending') {
      return tasks.filter(task => !task.completed);
    }
    if (filter == 'completed') {
      return tasks.filter(task => task.completed);
    }
    return tasks;
  })

  newTaskCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      // Validators.pattern()
    ]
  }); // El primer valor es el por defecto

  changeHandler() {
    if (this.newTaskCtrl.valid) {
      const value = this.newTaskCtrl.value.trim();
      if (value !== '') {
        this.addTask(value)
        this.newTaskCtrl.setValue('') // Deja el inpuit en vacio cuando se guarda una tarea
      }
    }
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title: title,
      completed: false
    };
    this.tasks.update((tasks) => [...tasks, newTask]);
  }

  deleteTask(index: number) {
    this.tasks.update((tasks) => tasks.filter((task, position) => position !== index))
  }

  updateTask(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            completed: !task.completed
          }
        }
        return task;
      })
    })
  }

  toogleChekedTask(index: number) {
    this.tasks.update((tasks) => tasks.map((task, position) => {
      if (position === index) {
        task.completed = !task.completed;
      }
      return task;
    }));
  }
  updateTaskEditingMode(index: number) {
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            editing: !task.editing
          }
        }
        return {
          ...task,
          editing: false
        };
      })
    })
  }
  
  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement
    this.tasks.update((tasks) => {
      return tasks.map((task, position) => {
        if (position === index) {
          return {
            ...task,
            title: input.value,
            editing: !task.editing
          }
        }
        return task;
      })
    })
  }
  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter);
  }
}
