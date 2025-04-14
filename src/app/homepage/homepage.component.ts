import { ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HomepageService } from './_service/homepage.service';
import { Developer, MockData } from './_model/homepage.model';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatDatepicker, MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { NewTaskDialog } from './dialog/new-task-dialog.component';

let TASK_DATA: MockData[] = [
    { id:'1', task: 'Implement Login', developer: [], status: 'In Progress', priority: 'High', type: 'Feature Enhancements', date: '25 Mar, 2025', estimatedSP: 5, actualSP: 3, isChecked: false },
    { id:'3', task: 'Fix Bug #123', developer: [], status: 'Waiting for review', priority: 'Critical', type: 'Other', date: '26 Mar, 2025', estimatedSP: 3, actualSP: 2, isChecked: false },
    { id:'4', task: 'Sample Task data', developer: [{ id: crypto.randomUUID(), name: 'Alice', image: 'https://randomuser.me/api/portraits/women/3.jpg' }], status: 'Pending Deploy', priority: 'Low', type: 'Bug', date: '26 Mar, 2025', estimatedSP: 3, actualSP: 2, isChecked: false },
];

const DEVELOPER: Developer[] = [
    { id: crypto.randomUUID(), name: 'Bob', image: 'https://randomuser.me/api/portraits/men/1.jpg' },
    { id: crypto.randomUUID(), name: 'Toni', image: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: crypto.randomUUID(), name: 'Alice', image: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: crypto.randomUUID(), name: 'Sam', image: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: crypto.randomUUID(), name: 'Anto', image: 'https://randomuser.me/api/portraits/men/5.jpg' },
    { id: crypto.randomUUID(), name: 'Diding', image: 'https://randomuser.me/api/portraits/men/6.jpg' },
    { id: crypto.randomUUID(), name: 'George', image: 'https://randomuser.me/api/portraits/men/7.jpg' },
    { id: crypto.randomUUID(), name: 'Saepul', image: 'https://randomuser.me/api/portraits/men/8.jpg' },
];

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  title = 'kanban-project';
  type: 'main' | 'kanban' = 'main';
  dataList: MockData[] = [];
  isNewTask: boolean = false;
  isOpenPerson: boolean = false;
  isOpenSort: boolean = false;
  sort: string[] = ['Ascending', 'Descending']
  input = new FormControl('');
  search: string = '';
  addNewTask: string = '';
  listDeveloper: Developer[] = [];

  selectedIndex : number = 0;
  tab: string = '';
  optionsStatus = [
    { value: 'Ready to start', label: 'bg-blue-500' },
    { value: 'In Progress', label: 'bg-yellow-500' },
    { value: 'Waiting for review', label: 'bg-cyan-500' },
    { value: 'Pending Deploy', label: 'bg-orange-500' },
    { value: 'Done', label: 'bg-green-500' },
    { value: 'Stuck', label: 'bg-pink-700' }
  ];
  optionsPriority = [
    { value: 'Critical', label: 'bg-rose-950' },
    { value: 'High', label: 'bg-red-500' },
    { value: 'Medium', label: 'bg-yellow-400' },
    { value: 'Low', label: 'bg-green-400' },
    { value: 'Best Effort', label: 'bg-blue-400' },
  ];
  optionsType = [
    { value: 'Feature Enhancements', label: 'bg-zinc-500' },
    { value: 'Other', label: 'bg-pink-400' },
    { value: 'Bug', label: 'bg-fuchsia-700' },
  ];

  selectedDate: Date = new Date();
  @ViewChild('picker') datepicker!: MatDatepicker<any>;
  @ViewChildren('taskInput') taskInputs!: QueryList<ElementRef>;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef;
  @ViewChild('focusNewTask') focusNewTask!: ElementRef<HTMLInputElement>;


  columns: { id: string, title: string; label: string; status: string; tasks: MockData[] }[] = [
    { id:'1', title: 'Ready to start', label: 'bg-blue-500', status: 'Ready to start', tasks: [] },
    { id:'2', title: 'In Progress', label: 'bg-yellow-500', status: 'In Progress', tasks: [] },
    { id:'3', title: 'Waiting for review', label: 'bg-cyan-500', status: 'Waiting for review', tasks: [] },
    { id:'4', title: 'Pending Deploy', label: 'bg-orange-500', status: 'Pending Deploy', tasks: [] },
    { id:'5', title: 'Done', label: 'bg-green-500', status: 'Done', tasks: [] },
    { id:'6', title: 'Stuck', label: 'bg-pink-700', status: 'Stuck', tasks: [] }
  ];

  selectedFilterPerson: string = '';
  selectedSortKanban: string = '';

  constructor(
    private service: HomepageService,
    private dialog: MatDialog,
  ) {
    
  }

  ngOnInit(): void {
    this.getDataList();
    this.dataList = TASK_DATA as MockData[];
    this.listDeveloper = DEVELOPER;
    this.initForm();
    this.addTaskToColumns();
  }

  // -----------KANBAN ------------
  addTaskToColumns() {
    this.columns.forEach(column => {
        column.tasks = TASK_DATA.filter(task => task.status === column.status);
    });
  }

  drop(event: CdkDragDrop<MockData[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    const movedItem = event.container.data[event.currentIndex];
    const targetColumn = this.columns.find(column => column.id === event.container.id);
    
    if (targetColumn) {
      movedItem.status = targetColumn.status;
      movedItem.isChecked = targetColumn.status === 'Done' ? true :false;
    }
    this.addTaskToColumns();
  }

  getListColId(){
    return this.columns.map(l => l.id)
  }

  editKanbanTask(idColumn: string, item: MockData){
    this.dialog.open(NewTaskDialog, {
      data: {
        optionsStatus : this.optionsStatus,
        optionsPriority : this.optionsPriority,
        optionsType : this.optionsType,
        listDeveloper : this.listDeveloper,
        newTaskKanban: {...item}
      }
    }).afterClosed().subscribe((res) => {
      if(res){
        this.columns.filter((key) => {
          if(key.id === idColumn){
            let task = key!.tasks!.find((task) => task.id === res.id);
            if (task) {
              Object.assign(task, res);
            }
          }
          return key;
        })
      }
    })
  }

  filterSearchKanban(searchTerm: string) {
    let data = this.columns.map(column => ({
      ...column,
      tasks: [...column.tasks] // Membuat salinan baru dari tasks
    }));
    return data.map(column => {
      column.tasks = column.tasks.filter(key => key.task.toLowerCase().includes(searchTerm.toLowerCase()));
      return column;
    });
  }

  filterPersonKanban(name: string) {
    let data = this.columns.map(column => ({
      ...column,
      tasks: [...column.tasks] // Membuat salinan baru dari tasks
    }));

    if (name !== ''){
      return data.map(column => {
        column.tasks = column.tasks.filter((res) => 
          res.developer.some((key) => key.name.includes(name)));
        return column;
      });
    }

    return data;
    
  }

  filterSortKanban(type: string) {
    let data = this.columns.map(column => ({
      ...column,
      tasks: [...column.tasks] // Membuat salinan baru dari tasks
    }));

    if(type == 'Ascending'){
      return data.map(column => {
        column.tasks = column.tasks.sort((a, b) =>  a.task.localeCompare(b.task));
        return column;
      });
    }
    return data.map(column => {
      column.tasks = column.tasks.sort((a, b) =>  b.task.localeCompare(a.task));
      return column;
    });
  }

  isColumnFilter(){
    if(this.input.value !== '' && this.input.value !== null){
      return this.filterSearchKanban(this.input.value);
    }

    if(this.selectedFilterPerson !== ''){
      return this.filterPersonKanban(this.selectedFilterPerson === 'all' ? '' : this.selectedFilterPerson);
    }

    if(this.selectedSortKanban !== ''){
      return this.filterSortKanban(this.selectedSortKanban);
    }
    
    return this.columns;
  }

  // ---------- MAIN -----------------

  getDataList(){
    this.service.getData().subscribe({
        next: (res) => {
        },
        error: (err) => {

        }
    })
  }

  toggleAddNewTask(){
    this.isNewTask = !this.isNewTask;
    if(this.type === 'kanban'){
      this.dialog.open(NewTaskDialog, {
        data: {
          optionsStatus : this.optionsStatus,
          optionsPriority : this.optionsPriority,
          optionsType : this.optionsType,
          listDeveloper : this.listDeveloper,
          newTaskKanban: null
        }
      }).afterClosed().subscribe((res) => {
        if(res){
          this.columns.filter((key) => {
            if(key.status === res.status){
              key.tasks.unshift(res);
            }
            return res;
          })
        }
      })
    }else{
      setTimeout(() => {
        this.focusNewTask?.nativeElement?.focus();
      });
    }


  }

  toggleSetType(type: "main" | "kanban"){
    this.type = type;
    this.input.setValue('', {emitEvent: false});
    this.selectedFilterPerson = '';
    if(type === 'main'){
      console.log('this.columns', this.columns);
      this.dataList = this.columns.flatMap(res => res.tasks);
      TASK_DATA = this.columns.flatMap(res => res.tasks);
      
    }else{
      this.addTaskToColumns();
    }
  }

  initForm(){
    this.input.valueChanges.pipe(debounceTime(500),distinctUntilChanged()).subscribe(value => {
        if(value !== undefined && value !== null && value !== ''){
          if(this.type === 'main'){
            this.dataList = TASK_DATA.slice().filter((res) => 
              res.task.trim().toLocaleLowerCase().includes(value.trim().toLocaleLowerCase())
            );
          }
          this.selectedFilterPerson = '';
        }else{
          if(this.type === 'main'){
            this.dataList = [...TASK_DATA];
          }
        }
    })
  }

  trackByFn(index: number, item: any): number {
    return item.id; // Gunakan ID unik untuk tracking
  }

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value!;
    return moment(event.value).format('DD MMMM, YYYY')
  }

  openPanelByType(index: number, tab: string, event: Event, item: MockData){
    this.selectedIndex = this.selectedIndex === index + 1 ? 0 : index + 1; 
    this.tab = tab;
    this.selectedDate = new Date(item.date);
    if (tab === 'date' && this.selectedIndex === index + 1) {
        setTimeout(() => {
          this.datepicker.open();
        }, 10);
    }
    if (tab === 'task' && this.selectedIndex === index + 1) {
        setTimeout(() => {
            const inputToFocus = this.taskInputs?.get(this.selectedIndex - 1);
            if (inputToFocus) {
              inputToFocus?.nativeElement?.focus();
            }
        }, 0);
    }
    event.preventDefault();
  }

  getChangeStatusByCheckbox(item: MockData){
    this.dataList.filter((res) => res.id === item.id && (res.status = res.isChecked ? 'Ready to start' : 'Done'))
  }

  handleChanges(event: Event){
    const isChecked = (event.target as HTMLInputElement).checked;
    if(isChecked){
        this.dataList.filter((res) => (res.isChecked = true) && (res.status = res.isChecked ? 'Done' : 'Ready to start'))
    }else{
        this.dataList.filter((res) => (res.isChecked = false) || (res.status = !res.isChecked ? 'Ready to start' : 'Done'));
    }
  }

  AddTask(event: Event) {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    if(this.addNewTask !== ''){
        let newTask = { task: this.addNewTask, status: 'Ready to start', id: crypto.randomUUID(), date: formattedDate, developer: [], estimatedSP: 0, actualSP: 0 } as unknown as MockData;
        // this.dataList.unshift(newTask);
        TASK_DATA.unshift(newTask);
        this.dataList = TASK_DATA;
        this.addNewTask = '';
    }
  }

  getListExistingDeveloper(item: MockData){
    const filteredDevelopers = this.listDeveloper.filter(dev => 
        !item.developer?.some(existing => existing.name === dev.name)
    );
    return filteredDevelopers;
  }

  setDeveloper(idParent:string, image: Developer){
    this.dataList.filter((res) => res.id === idParent && res.developer.push(image));
    this.selectedIndex = 0;
    this.tab = '';
  }

  deleteDeveloper(idParent:string, image: Developer){
    this.dataList.map((res) => {
      if (res.id === idParent) {
        res.developer = res.developer.filter((key) => key.id !== image.id);
      }
      return res;
    });
    this.selectedIndex = 0;
    this.tab = '';
  }

  sortingDataList(type: string){
    if(type == 'Ascending'){
      if(this.type === 'main') this.dataList = TASK_DATA.sort((a, b) =>  a.task.localeCompare(b.task));
      this.selectedSortKanban = 'Ascending';
    }else{
      if(this.type === 'main') this.dataList = TASK_DATA.sort((a, b) =>  b.task.localeCompare(a.task));
      this.selectedSortKanban = 'Descending';
    }

    this.input.setValue('', {emitEvent:false});
    this.selectedFilterPerson = '';
    
    this.isOpenPerson = false;
    this.isOpenSort = !this.isOpenSort;
  }

  filterDeveloperByName(name: string){
    if(name == 'all'){
      if(this.type === 'main')this.dataList = TASK_DATA;
      this.selectedFilterPerson = 'all';
    }else{
      if(this.type === 'main'){
        this.dataList = TASK_DATA.slice().filter((res) => 
            res.developer.some((key) => key.name.includes(name))
        );
      }
      this.selectedFilterPerson = name;
    }

    this.input.setValue('', {emitEvent:false});
    this.selectedSortKanban = '';
    this.isOpenPerson = !this.isOpenPerson;
    this.isOpenSort = false;
  }

  getTextareaHeight(index: number): any {
    const textarea = document.querySelector(`textarea[data-index="${index}"]`) as HTMLTextAreaElement;
    if (textarea) {
        textarea.style.height = "auto";  // Reset tinggi sebelum mengukur ulang
        textarea.style.height = textarea.scrollHeight + "px"; // Set tinggi sesuai isi teks
        return textarea.style.height;
    }else{
        return '0px';
    }
  }

  getStatusColor(status: string) {
    return this.optionsStatus.find((res) => res.value === status)?.label! || 'bg-gray-500';
  }

  getPriorityColor(priority: string) {
    return this.optionsPriority.find((res) => res.value === priority)?.label! || 'bg-gray-500';
  }

  getTypeColor(type: string) {
    return this.optionsType.find((res) => res.value === type)?.label! || 'bg-gray-500';
  }

  getTotalDeveloperAssigned(){
    const uniqueDevelopers = Array.from(
        this.dataList
            .flatMap(data => data.developer)
            .reduce((map, dev) => map.set(dev.name, dev), new Map<string, { id: string; name: string; image: string }>())
            .values()
    );
    return uniqueDevelopers
  }

  getStatusColorAssigned(){
    // const uniqueStatus = Array.from(new Set(this.dataList.map(task => task.status)));
    return this.getPercentageOfTotalData('status');
  }

  getPriortyColorAssigned(){
    // const uniquePriority = Array.from(new Set(this.dataList.map(task => task.priority)));
    return this.getPercentageOfTotalData('priority');
  }

  getTypeColorAssigned(){
    // const uniqueType = Array.from(new Set(this.dataList.map(task => task.type)));
    return this.getPercentageOfTotalData('type');
  }

  getTotalEstimatedSP(){
    const totalEstimatedSP = this.dataList.reduce((acc, curr) => Number(acc) + Number(curr.estimatedSP), 0);
    return totalEstimatedSP;
  }

  getTotalActualSP(){
    const totalActualSP = this.dataList.reduce((acc, curr) => Number(acc) + Number(curr.actualSP), 0);
    return totalActualSP;
  }

  getDateRange(){
    const sortedTasks = [...this.dataList].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const dateRange = sortedTasks[0]?.date! ? `${sortedTasks[0]?.date!} - ${sortedTasks[sortedTasks.length - 1]?.date!}` : '-';
    return dateRange
  }

  getPercentageOfTotalData(key: keyof MockData){
    let total: Record<string, number> = {};
    this.dataList.forEach((res) => {
      const value = res[key as keyof MockData] as string;
      total[value] = (total[value] || 0) + 1; 
    });
    
    let percent = Object.entries(total).map(([color, count]) => ({
      color, percentage: ((count / this.dataList.length) * 100).toFixed(0).toString()
    }));
    return percent
  }
}
