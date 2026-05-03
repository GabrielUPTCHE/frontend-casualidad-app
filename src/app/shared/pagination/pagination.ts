import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css']
})
export class PaginationComponent implements OnChanges {
  @Input() totalItems = 0;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() itemName = 'elementos';
  
  @Output() pageChange = new EventEmitter<number>();

  totalPages = 1;
  pages: number[] = [];
  displayedItems = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['totalItems'] || changes['pageSize'] || changes['currentPage']) {
      this.calculatePagination();
    }
  }

  private calculatePagination(): void {
    this.totalPages = Math.ceil(this.totalItems / this.pageSize) || 1;
    this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    
    // Calculate displayed items count
    const start = (this.currentPage - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, this.totalItems);
    this.displayedItems = end - start;
    if (this.displayedItems < 0) this.displayedItems = 0;
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }
}
