import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AudioManagerService } from '../services/audio-manager.service';
import { ConstantsService } from '../services/constants.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {

  @ViewChild('sidebarNavigator') sidebar: ElementRef;
  constructor(private audioManagerService: AudioManagerService) { }

  ngOnInit(): void {
    this.audioManagerService.stopIfAudioIsPlaying();
    this.audioManagerService.playBackgroundSound(ConstantsService.mainThemeAudioFilePath);
  }

  openNav() {
    this.sidebar.nativeElement.style.width = '100%';
  }

  closeNav() {
    this.sidebar.nativeElement.style.width = '0%';
  }
}
