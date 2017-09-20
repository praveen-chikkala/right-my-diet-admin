import { Component, ViewContainerRef, NgZone  } from '@angular/core';
import {TipsService} from '../providers/tipsProvider/tipsProvider';
import { Router, ActivatedRoute } from '@angular/router';
import { Overlay } from 'ngx-modialog';
import { Modal, BSModalContext } from 'ngx-modialog/plugins/bootstrap';
import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';

@Component({
  templateUrl: 'tipsLists.component.html'
})
export class tipsListComponent {
  private logoImg;
  public tips;
  itemsPPage = 10;
  curPage = '1';
  searchText:any = ' ';
  Categories:any = [];
  categoryIdVal:any = "all";
  constructor(public tipsService: TipsService, public router: Router, private zone: NgZone, overlay: Overlay, vcRef: ViewContainerRef, public modal: Modal,private route: ActivatedRoute) {
    
    this.curPage = route.params['_value']['page'];
    this.searchText = route.params['_value']['search'];
    this.loadCategories();
    if(this.searchText != ' '){
      var b = this.getUserId(); 
      this.searchTips(this.searchText,'all');
    } else {
      this.loadTips();
    }
  }
  getUserId = function(){
    var a = localStorage.getItem('userData');
    a = JSON.parse(a);
    var b =[];
    b.push(a);
    return b;
  }
  loadTips() {
    var b = this.getUserId();    
    this.tipsService.load(b[0].id)
      .then(data => {
        this.tips = data;
      });      
  }

  clearSearch(){
    this.searchText = '';
    this.router.navigate(['/Tips/'+this.curPage+'/ ']);
    this.loadTips();    
  }

  loadCategories(){
    this.tipsService.getCategories()
      .then(data => {
      
        this.Categories = data;
      });
  }

  removeTip(tip) {
    var confirmed = confirm("Are you sure to delete?");
    if(confirmed){
      this.tipsService.deleteTip(tip.id)
        .then(
          data => {
            this.tips.splice(this.tips.indexOf(tip),1);
            console.log(data);
          }, //Bind to view
          err => {
            // Log errors if any
            console.log(err);
          });
    }

  }

  searchTips(searchTerm,categoryIdVal){
    this.router.navigate(['/Tips/'+this.curPage+'/'+searchTerm]);
    var b = this.getUserId(); 
    if(searchTerm != ''){
    this.tipsService.searchTips(searchTerm, categoryIdVal,b[0].id)
      .then(
        data => {   
          this.tips = data;
        }, //Bind to view
        err => {
          // Log errors if any
          console.log(err);
        });
    } else {
       this.router.navigate(['/Tips/'+this.curPage+'/ ']);
       this.loadTips()
    }
  }
  makePublish(tip){
    this.tipsService.makePublish(tip.id)
      .then(
        data => {
          this.tips[this.tips.indexOf(tip)].status = 'ACTIVE';
          this.tipPublished();
          console.log(data);
        }, //Bind to view
        err => {
          // Log errors if any
          console.log(err);
        });
  }

    hideRole(role){

    var a = localStorage.getItem('userData');

    a = JSON.parse(a);
    var b =[];
    b.push(a);
    if(b[0].role[0] == role){
      return false;
    }
    else{
      return true;
    }
  }
  tipPublished(){
    this.modal.alert()
      .size('sm')
      .showClose(true)
      .title('Added Tip')
      .body(`<p>Your Tip is published successfully</p>`)
      .open();
  }

  /* Preview functionality */
  showPreview(tip) {
  //let source = tip.images[0];
  this.logoImg =  "https://wishcop.s3.amazonaws.com/c81ac6d6-c20b-43ed-831d-7ef77ce86617.jpg";
  //console.log(source);
  let tipTitle = tip.title;
      this.modal.alert()
      .size('sm')
      .showClose(true)
      .title('Added Tip')
      .body(`<img style="width:100%;height:100%;" src= "https://wishcop.s3.amazonaws.com/c81ac6d6-c20b-43ed-831d-7ef77ce86617.jpg" />` + `<div>dfgdfg</div>`)
      .open();
  }

  /* Preview functionality */
  pagination(i,p){    

    return ((Number(this.curPage)- 1)*this.itemsPPage)+i+1;

  }

  changePage(event){
    this.router.navigate(['/Tips/'+event+'/'+this.searchText]);
    this.curPage = event;
  }

}
