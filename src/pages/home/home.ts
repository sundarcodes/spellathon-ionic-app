import { Component } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, LoadingController } from 'ionic-angular';
import { Http, Headers } from '@angular/http'
import { Observable, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  lettersArr$: Observable<string[]>;
  count: BehaviorSubject<number>;
  maxLength$: Observable<number>;
  btnSelected: any;
  mandatoryLetter: string;
  dictWords$: Observable<any>;
  // lettersArr: string
  letterInput: any;
  lettersListSub: BehaviorSubject<string[]>;
  constructor(public navCtrl: NavController, private _http: Http, private _loadingCtrl: LoadingController
  , private _formBuilder: FormBuilder) {
    this.lettersListSub = new BehaviorSubject([]);
    this.lettersArr$ = this.lettersListSub.asObservable();
    this.maxLength$ = this.lettersArr$.count();
    this.count = new BehaviorSubject(0);
    this.maxLength$ = this.count.asObservable();
    this.btnSelected = {};
    this.letterInput = this._formBuilder.group({
      lettersList: ['', Validators.compose([Validators.maxLength(10), Validators.required, Validators.minLength(4),
      Validators.pattern("[a-z]*")])],
      mandLetter: ['', Validators.required]
    })
  }

  onLetterPress(letters: string) {
    // console.log(letters.toLowerCase());
    this.lettersListSub.next(letters.split(''));
    this.count.next(letters.length);
    this.mandatoryLetter = '';
    this.btnSelected = {};
  }

  letterChosen(letter) {
    console.log(letter);
    // this.btnSelected = {};
    this.btnSelected[letter] = !this.btnSelected[letter]
    this.mandatoryLetter = letter;
  }

  validateLetterSelected(c: FormControl) {
    console.log(c.value);
    return c.value ? null : {
      validateEmail: {
        valid: false
      }
    };
  }


  fetchDictionaryWords() {
    const url: string = `https://y7g9yey5yc.execute-api.us-east-1.amazonaws.com/dev/dict?letters=${this.letterInput.value.lettersList}&mand=${this.mandatoryLetter}&length=4`;
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
