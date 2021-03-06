import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Player } from "../interfaces/player";
import { Pairing } from "../interfaces/pairing";
import { disableDebugTools } from "@angular/platform-browser";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class QuestionService {
  // Store the appropriate base URL. Angular automatically selects the right environment file.
  private readonly BASE_URL = environment.pvsBaseUrl;
  constructor(private http: HttpClient) {}
  currentScoreArr: any[] = [];
  sheeple: number = 0;
  peeple: number = 0;
  yourAnswers: any[] = [];
  otherAnswers: any[] = [];
  bad: boolean = false;

  /// sets new questions for table
  // setNewPairing(scenario: string, scenario2: string) {
  //   this.newPairing.scenario = scenario;
  //   this.newPairing.scenario2 = scenario2;
  //   this.newPairing.rating = 1;
  //   this.newPairing.rating2 = 1;
  //   console.log(this.newPairing);
  // }
  //// gets all questions from Database for the array

  getAllQuestions(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/questions/`);
  }

  addQuestions(scenario, scenario2): Observable<any> {
    event.preventDefault();

    let newPairing: Pairing = {
      scenario: "",
      scenario2: "",
      rating: 0,
      rating2: 0
    };
    newPairing.scenario = scenario;
    newPairing.scenario2 = scenario2;

    // let words = filter.list;
    // console.log("badwords length", words.length);
    // let scenario1Str = scenario.toLowerCase();
    // let scenario2Str = scenario2.toLowerCase();

    // for (let word of words) {
    //   if (scenario1Str.includes(word) === true) {
    //     console.log("bad sentence 1");
    //     this.bad = true;
    //     return;
    //   } else {
    //     console.log("ok sentence 1");
    //   }
    // }
    // for (let word of words) {
    //   if (scenario2Str.includes(word) === true) {
    //     console.log("bad sentence 2");
    //     this.bad = true;
    //     return;
    //   } else {
    //     console.log("ok sentence 2");
    //   }
    // }
    newPairing.rating = 1;
    newPairing.rating2 = 1;
    console.log(newPairing, 818);
    console.log("submitted");
    return this.http.post(`${this.BASE_URL}/add-question`, newPairing);
  }

  isBadWord() {
    console.log(this.bad, "service");
    return this.bad;
  }

  refreshBad() {
    this.bad = false;
  }

  //// adds one to whatever scenario was chosen
  ratingPlusOne(id, scenario): Observable<void> {
    return this.http.put<void>(`${this.BASE_URL}/rating${scenario}/${id}`, "");
  }

  //// resets score when navigating away from page
  resetScoreArr(): void {
    this.currentScoreArr = [];
  }

  //// get's rating to use in totalling score
  // getRating(id, num): Observable<any> {
  //   console.log("sevice ID", id);
  //   console.log("service num", num);
  //   return this.http.get(`${this.BASE_URL}/ratingnum${num}/${id}`);
  // }

  getAnswer(id, num): Observable<any> {
    return this.http.get(`${this.BASE_URL}/questions/${id}`);
  }

  getRating(id, num): Observable<any> {
    return this.http.get(`${this.BASE_URL}/ratingnum${num}/${id}`);
  }

  //// gets score in an array in order to calculate on the score page
  setCurrentScore(id, num): void {
    this.getAnswer(id, num).subscribe(data => {
      let answerPair = data;
      answerPair.push(num);
      this.yourAnswers.push(answerPair);
      // sees which is larger between rating and rating2,
      // then increments the corresponding category variable
      console.log("answer pair", answerPair);
      if (
        (num === 1 && answerPair[0].rating >= answerPair[0].rating2) ||
        (num === 2 && answerPair[0].rating2 >= answerPair[0].rating)
      ) {
        this.sheeple++;
      } else {
        this.peeple++;
      }
      console.log(1, "sheeple count", this.sheeple, "peep count", this.peeple);
    });
    console.log(2, "sheeple count", this.sheeple, "peep count", this.peeple);
    this.getRating(id, num).subscribe(data => {
      let addNum = Number(data);
      this.currentScoreArr.push(addNum);
    });
    console.log("num", num);
    console.log(3, "sheeple count", this.sheeple, "peep count", this.peeple);
    console.log(this.yourAnswers);
  }

  getCategory() {
    if (this.sheeple >= this.peeple) return "sheeple";
    else return "peeple";
  }

  //// resets answer array
  resetAnswerArr(): void {
    this.yourAnswers = [];
  }

  //// sends the currentScoreArr from the service for score total
  getCurrentScore(): any[] {
    return this.currentScoreArr;
  }

  //// sends the answer arrays to the scores page
  getYourAnswers() {
    return this.yourAnswers;
  }

  getOtherAnswers() {
    return this.otherAnswers;
  }

  //// Gets high scores of sheeple
  getSheepleScores(): Observable<any> {
    console.log(`${this.BASE_URL}/top-sheeple`);
    return this.http.get(`${this.BASE_URL}/top-sheeple`);
  }

  //// Gets high scores of peeple
  getPeepleScores(): Observable<any> {
    console.group(`${this.BASE_URL}/top-peeple`);
    return this.http.get(`${this.BASE_URL}/top-peeple`);
  }
  //// Gets average of scores
  getScoreAvg(): Observable<any> {
    return this.http.get(`${this.BASE_URL}/avg-score`);
  }

  // getRandomQuestions(): Observable<any>[] {
  //   let twoQuestions: any[];
  //   for (let i = 0; i < 2; i++) {
  //     let randQ = this.http.get(`http://localhost:3002/questions/random`);
  //     twoQuestions.push(randQ);
  //   }
  //   return twoQuestions;
  // }
}
