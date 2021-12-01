import { Injectable } from "@angular/core";
import { IShow } from "./show.interface";

const LOCAL_STORAGE_KEY = "PANDORA_SHOWS";
@Injectable({
  providedIn: "root",
})
export class ShowService {
  constructor() {
    this.initializeLocalStorage();
  }

  public addShow(name: string) {
    const newShow: IShow = { name };
    const allShows = this.retrieveShows();

    allShows.push(newShow);
    this.saveShows(allShows);
  }

  public deleteShow(name: string) {
    const allShows = this.retrieveShows();

    const deletedShowIndex = allShows.findIndex((show) => {
      return show.name === name;
    });

    allShows.splice(deletedShowIndex, 1);
    this.saveShows(allShows);
  }

  public retrieveShows(): IShow[] {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
  }

  public updateShow(name: string) {}

  private saveShows(shows: IShow[]) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(shows));
  }

  private initializeLocalStorage() {
    const shows = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!shows) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    }
  }
}
