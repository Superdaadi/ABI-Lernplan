import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  SecurityContext,
  inject,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked, Tokens } from 'marked';

@Component({
  selector: 'app-lernplan',
  imports: [CommonModule],
  templateUrl: './lernplan.html',
  styleUrl: './lernplan.css',
})
export class Lernplan {
  /** Raw markdown string to render */
  @Input() content = '';
 
  /** Alternatively, pass a file URL – the component fetches it */
  @Input() src = '';
 
  renderedHtml: SafeHtml = '';
  loading = false;
  error = '';
  sourceId = ''; // Eindeutige ID für das aktuelle Dokument (Filename oder URL)

  route = inject(ActivatedRoute);
 
  ngOnInit(): void {
    const src = this.route.snapshot.data['src'];
    if (src) this.loadFromUrl(src);   // die private Methode existiert bereits
  }

  private sanitizer = inject(DomSanitizer);
 
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['content']) {
      this.render(this.content);
    }
    if (changes['src'] && this.src) {
      this.loadFromUrl(this.src);
    }
  }
 
  // ── File-drop support ──────────────────────────────────────────────────────
 
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.add('drag-over');
  }
 
  onDragLeave(event: DragEvent): void {
    (event.currentTarget as HTMLElement).classList.remove('drag-over');
  }
 
  onDrop(event: DragEvent): void {
    event.preventDefault();
    (event.currentTarget as HTMLElement).classList.remove('drag-over');
    const file = event.dataTransfer?.files[0];
    if (file) this.readFile(file);
  }
 
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.sourceId = file.name;
      this.readFile(file);
    }
  }
 
  private readFile(file: File): void {
    if (!file.name.endsWith('.md') && file.type !== 'text/markdown') {
      this.error = 'Bitte eine .md-Datei auswählen.';
      return;
    }
    this.sourceId = file.name;
    this.error = '';
    this.loading = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.render(e.target?.result as string);
      this.loading = false;
    };
    reader.onerror = () => {
      this.error = 'Datei konnte nicht gelesen werden.';
      this.loading = false;
    };
    reader.readAsText(file);
  }
 
  private async loadFromUrl(url: string): Promise<void> {
    this.loading = true;
    this.error = '';
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      this.sourceId = url.split('/').pop() || url;
      this.render(text);
    } catch (err) {
      this.error = `Fehler beim Laden: ${(err as Error).message}`;
    } finally {
      this.loading = false;
    }
  }
 
  // ── Markdown → HTML ────────────────────────────────────────────────────────
 
  private render(markdown: string): void {
    // ── Preprocessing: join split links  ────────────────────────────────────
    // marked's `breaks:true` treats every newline as <br>, which breaks
    // markdown links whose `](url)` spans two lines.
    // This regex collapses any whitespace between ] and ( back to nothing.
    const normalized = markdown.replace(/\]\s*\n\s*\(/g, '](');

    const renderer = new marked.Renderer();

    renderer.link = ({ href, title, text }: Tokens.Link): string => {
      const t = title ? ` title="${title}"` : '';
      return `<a href="${href}"${t} target="_blank" rel="noopener noreferrer">${text}</a>`;
    };

  // Innerhalb der render() Methode:

  let taskIndex = 0;
  renderer.listitem = (item: Tokens.ListItem): string => {
    const content = marked.parseInline(item.text, { gfm: true });

    if (item.task) {
      const index = taskIndex++;
      // Stand aus LocalStorage laden
      const savedState = localStorage.getItem(`task-state-${this.sourceId}-${index}`);
      const isChecked = savedState === 'true' || (savedState === null && item.checked);
      
      const checkedAttr = isChecked ? 'checked' : '';
      const cls = isChecked ? 'task-item task-item--done' : 'task-item';
      
      return `<li class="${cls}">
        <label>
          <input type="checkbox" ${checkedAttr} data-task-index="${index}"/>
          <span>${content}</span>
        </label>
      </li>`;
    }
    
    return `<li>${content}</li>`;
  };

    const rawHtml = marked.parse(normalized, {   // <-- normalized statt markdown
      renderer,
      gfm: true,
      breaks: true,
    }) as string;

    this.renderedHtml = this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  }

  private parseInlineTokens(tokens: any[]): string {
    return tokens.map(token => {
      if (token.type === 'text') return token.text;
      if (token.type === 'link') {
        return `<a href="${token.href}" title="${token.title || ''}" target="_blank" rel="noopener noreferrer">${token.text}</a>`;
      }
      return token.raw;
    }).join('');
  }

  onTaskChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target && target.type === 'checkbox' && target.dataset['taskIndex'] !== undefined) {
      const index = target.dataset['taskIndex'];
      const key = `task-state-${this.sourceId}-${index}`;
      const isChecked = target.checked;
      
      localStorage.setItem(key, isChecked ? 'true' : 'false');
      
      // CSS Klasse für das li-Element umschalten (für die Durchstreichung)
      const li = target.closest('li');
      if (li) {
        if (isChecked) li.classList.add('task-item--done');
        else li.classList.remove('task-item--done');
      }
    }
  }

  
}
