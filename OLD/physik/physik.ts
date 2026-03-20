import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import lernplanData from '../../../public/assets/physik.json';



export interface LeifiLink {
  label: string;
  url: string;
}

export interface Block {
  zeit_von: string;
  zeit_bis: string;
  thema: string;
  beschreibung: string;
  stufe: 'Q12' | 'Q13' | 'Wiederholung' | 'Simulation' | 'Pause';
  leifi_links: LeifiLink[];
}

export interface Tag {
  id: number;
  wochentag: string;
  tag_nr: number;
  titel: string;
  bloecke: Block[];
}

export interface Woche {
  id: number;
  titel: string;
  untertitel: string;
  stufe: 'Q12' | 'Q13';
  farbe: string;
  tipp: string;
  tage: Tag[];
}

export interface LernplanMeta {
  titel: string;
  klasse: string;
  pruefungsvorbereitung: string;
  dauer_wochen: number;
  stunden_pro_tag: number;
  erstellt: string;
}

export interface LernplanData {
  meta: LernplanMeta;
  wochen: Woche[];
}


@Component({
  selector: 'app-physik',
  imports: [CommonModule],
  templateUrl: './physik.html',
  styleUrl: './physik.css',
})
export class Physik {

  data: LernplanData = lernplanData as LernplanData;
  activeWoche: number = 0;
  openTage: Set<number> = new Set([this.data.wochen[0]?.tage[0]?.id]);

  ngOnInit(): void {}

  get aktuelleWoche(): Woche {
    return this.data.wochen[this.activeWoche];
  }

  setWoche(index: number): void {
    this.activeWoche = index;
    const firstTag = this.data.wochen[index]?.tage[0];
    this.openTage = new Set(firstTag ? [firstTag.id] : []);
  }

  toggleTag(tagId: number): void {
    if (this.openTage.has(tagId)) {
      this.openTage.delete(tagId);
    } else {
      this.openTage.add(tagId);
    }
  }

  isTagOpen(tagId: number): boolean {
    return this.openTage.has(tagId);
  }

  stufenClass(stufe: string): string {
    const map: Record<string, string> = {
      'Q12': 'tag--q12',
      'Q13': 'tag--q13',
      'Wiederholung': 'tag--rest',
      'Simulation': 'tag--sim',
      'Pause': 'tag--pause',
    };
    return map[stufe] ?? 'tag--rest';
  }

  get fortschritt(): number {
    return Math.round(((this.activeWoche + 1) / this.data.wochen.length) * 100);
  }
}