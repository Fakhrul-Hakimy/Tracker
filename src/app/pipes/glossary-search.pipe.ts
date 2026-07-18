import { Pipe, PipeTransform } from '@angular/core';
import { GlossaryTerm } from '../models/pcos.models';

@Pipe({
  name: 'glossarySearch',
  standalone: true
})
export class GlossarySearchPipe implements PipeTransform {
  transform(terms: GlossaryTerm[], query: string): GlossaryTerm[] {
    if (!terms?.length || !query?.trim()) {
      return terms;
    }

    const normalizedQuery = query.trim().toLowerCase();

    return terms.filter(
      (term) =>
        term.term.toLowerCase().includes(normalizedQuery) ||
        term.definition.toLowerCase().includes(normalizedQuery) ||
        term.userNotes.toLowerCase().includes(normalizedQuery)
    );
  }
}
