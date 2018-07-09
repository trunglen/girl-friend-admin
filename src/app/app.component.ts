import { Component } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore } from 'angularfire2/firestore';
import { Girl } from './models/girl.model';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  girl = { name: '', thumb: '',is_hot:false, gallery: [], fb_url: '', video_url: '' };
  loading = false
  success = 0
  constructor(
    private fs: AngularFireStorage,
    private db: AngularFireDatabase
  ) {
  }

  uploadThumb() {
    var file = (<HTMLInputElement>document.querySelector('#thumb')).files[0];
    var storageRef = this.fs.ref(guidGenerator() + '.png')
    this.loading = true
    var self = this
    if (file) {
      storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(function (downloadURL) {
          self.girl.thumb = downloadURL
          self.loading = false
          self.success = 1
        });
      }).catch(err => console.log(err))
    }
  }

  uploadGallery() {
    var file = (<HTMLInputElement>document.querySelector('#gallery')).files[0];
    var storageRef = this.fs.ref(guidGenerator() + '.png')
    this.loading = true
    var self = this
    if (file) {
      storageRef.put(file).then(snapshot => {
        snapshot.ref.getDownloadURL().then(function (downloadURL) {
          self.girl.gallery.push(downloadURL)
          self.loading = false
          self.success = 1
        });
      }).catch(err => {
        console.log(err)
        self.success = -1
      })
    }
  }

  onCreate() {
    this.db.database.ref('girl').push(this.girl,(err=>{
      console.log(err, 'db')
      this.success = 1
      this.girl = { name: '', thumb: '',is_hot:false, gallery: [], fb_url: '', video_url: '' }
    })).then(res=>{
      console.log(res)
      this.success = 1
      this.girl = { name: '', thumb: '', is_hot:false,gallery: [], fb_url: '', video_url: '' }
    })
  }
}


function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}