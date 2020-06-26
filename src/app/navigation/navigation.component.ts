import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @ViewChild("sidebarNavigator") sidebar: ElementRef;
  constructor() { }

  ngOnInit(): void {
  }

  openNav() {
    this.sidebar.nativeElement.style.width = "100%";
  }
  
  closeNav() {
    this.sidebar.nativeElement.style.width = "0%";
  }
}
