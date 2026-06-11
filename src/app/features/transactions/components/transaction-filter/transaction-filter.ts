import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-transaction-filter',
  imports: [],
  templateUrl: './transaction-filter.html',
  styleUrl: './transaction-filter.scss',
})
export class TransactionFilter {
  @Input() searchTerm = '';
  @Input() categoryFilter = 'All';
  @Input() categories: string[] = ['All'];

  @Output() searchTermChange =
    new EventEmitter<string>();

  @Output() categoryFilterChange =
    new EventEmitter<string>();

  @Output() clearFilters =
    new EventEmitter<void>();

  onSearch(event: Event): void {
    const value =
      (event.target as HTMLInputElement)
        .value;

    this.searchTermChange.emit(value);
  }

  onCategoryChange(event: Event): void {
    const value =
      (event.target as HTMLSelectElement)
        .value;

    this.categoryFilterChange.emit(value);
  }

  clear(): void {
    this.clearFilters.emit();
  }
}
