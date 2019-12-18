import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Player } from "../interfaces/player";
import { Pairing } from "../interfaces/pairing";
import { disableDebugTools } from "@angular/platform-browser";

@Injectable({
  providedIn: "root"
})
export class QuestionService {
  constructor(private http: HttpClient) {}
  currentScoreArr: any[] = [];
  sheeple: number = 1;
  peeple: number = 1;
  yourAnswers: any[] = [];
  otherAnswers: any[] = [];

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
    return this.http.get(`http://localhost:3003/questions/`);
  }

  addQuestions(scenario, scenario2): any {
    var Filter = require("bad-words"),
      filter = new Filter();
    let newPairing: Pairing = {
      scenario: "",
      scenario2: "",
      rating: 0,
      rating2: 0
    };
    newPairing.scenario = scenario;
    newPairing.scenario2 = scenario2;

    let words = filter.list;
    console.log(words);

    for (let word of words) {
      let str = scenario.toLowerCase();
      console.log(word);
      console.log("String", str);
      if (str.includes(word) === true) {
        window.alert("Don't be a bad person");
        return;
        console.log("Got Here");
      }
    }

    if (confirm("Are you sure you want to submit this question?")) {
      window.alert("Your question was submitted");
      newPairing.rating = 1;
      newPairing.rating2 = 1;
      console.log(newPairing);
      return this.http.post("http://localhost:3003/add-question", newPairing);
    } else {
      window.alert("You cancelled your submission");
      return;
    }
  }

  //// adds one to whatever scenario was chosen
  ratingPlusOne(id, scenario): Observable<void> {
    return this.http.put<void>(
      `http://localhost:3003/rating${scenario}/${id}`,
      ""
    );
  }

  // sees which is larger between rating and rating2,
  // then increments the corresponding category variable
  compare(id: number, scenarioNumber: number) {
    let first: number = 0;
    let second: number = 0;
    this.getRating(id, 1).subscribe(data => {
      first = data;
      console.log("first", first);
      this.getRating(id, 2).subscribe(data => {
        second = data;
        console.log("second", second);
        if (scenarioNumber === 1 && first < second) {
          this.peeple += 1;
        } else if (scenarioNumber === 2 && second < first) {
          this.peeple += 1;
        } else {
          this.sheeple += 1;
        }
      });
    });
    console.log("sheeple count", this.sheeple, "peeple count", this.peeple);
  }

  // resetCategory(): void {
  //   this.sheeple = 0;
  //   this.peeple = 0;
  // }

  //// resets score when navigating away from page
  resetScoreArr(): void {
    this.currentScoreArr = [];
  }

  //// get's rating to use in totalling score
  // getRating(id, num): Observable<any> {
  //   console.log("sevice ID", id);
  //   console.log("service num", num);
  //   return this.http.get(`http://localhost:3003/ratingnum${num}/${id}`);
  // }

  getAnswer(id, num): Observable<any> {
    return this.http.get(`http://localhost:3003/questions/${id}`);
  }

  getRating(id, num): Observable<any> {
    return this.http.get(`http://localhost:3003/ratingnum${num}/${id}`);
  }

  //// gets score in an array in order to calculate on the score page
  setCurrentScore(id, num): void {
    this.getRating(id, num).subscribe(data => {
      let addNum = Number(data);
      this.currentScoreArr.push(addNum);
    });
    this.getAnswer(id, num).subscribe(data => {
      let answerPair = data;
      answerPair.push(num);
      this.yourAnswers.push(answerPair);
      console.log(this.yourAnswers);
    });
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

  //// Gets high scores
  getHighScores(): Observable<any> {
    return this.http.get("http://localhost:3003/top-sheeple");
  }

  //// Gets low scores
  getLowScores(): Observable<any> {
    return this.http.get("http://localhost:3003/top-peeple");
  }
  //// Gets average of scores
  getScoreAvg(): Observable<any> {
    return this.http.get("http://localhost:3003/avg-score");
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
