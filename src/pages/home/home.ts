import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http'
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  lettersList: string;
  lettersArr$: Observable<string[]>;
  count: BehaviorSubject<number>;
  maxLength$: Observable<number>;
  btnSelected: any;
  mandatoryLetter: string;
  dictWords$: Observable<any>;
  // lettersArr: string
  lettersListSub: BehaviorSubject<string[]>;
  constructor(public navCtrl: NavController, private _http: Http, private _loadingCtrl: LoadingController) {
    this.lettersList = "";
    this.lettersListSub = new BehaviorSubject([]);
    this.lettersArr$ = this.lettersListSub.asObservable();
    this.maxLength$ = this.lettersArr$.count();
    this.count = new BehaviorSubject(0);
    this.maxLength$ = this.count.asObservable();
    this.btnSelected = {};
  }

  onLetterPress(letters) {
    console.log(letters);
    this.lettersListSub.next(letters.split(''));
    this.count.next(letters.length);
  }

  letterChosen(letter) {
    console.log(letter);
    this.btnSelected = {};
    this.btnSelected[letter] = !this.btnSelected[letter]
    this.mandatoryLetter = letter;
  }


  fetchDictionaryWords() {
    const url: string = `https://y7g9yey5yc.execute-api.us-east-1.amazonaws.com/dev/dict?letters=${this.lettersList}&mand=${this.mandatoryLetter}&length=4`;
    // let header = new Headers('C)
    let headers = new Headers({'Content-Type': 'application/json'});
    let loading = this._loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();
    this.dictWords$ = this._http.get(url, headers)
    .map(data => {
     loading.dismiss();
     return data.json().message;
    });
  }
}
