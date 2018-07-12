import {observable} from 'aurelia-framework';
import {computedFrom} from 'aurelia-framework';
import $ from 'jquery'
import {Contact} from './contact';

class SortDetails { fieldname = ""; asc = false;}

export class ContactList {
  private source: Contact[] = [];
  public @observable items: Contact[] = [];
  public @observable searchString: string = '';
  private sortDetails: SortDetails = new SortDetails();
  private const fieldnames: string[] = ['name', 'phone_number', 'address'];
    
  @computedFrom('sortDetails.fieldname','sortDetails.asc')
  get nameSortingClass(): string {
    return this.getSortingClass('name');
  }

  @computedFrom('sortDetails.fieldname','sortDetails.asc')
  get phoneSortingClass(): string {
    return this.getSortingClass('phone_number');
  }

  @computedFrom('sortDetails.fieldname','sortDetails.asc')
  get addressSortingClass(): string {
    return this.getSortingClass('address');
  }
 
  loadData() {
	let _this = this;
	$.ajax({
      type: "get",
      url: "http://www.mocky.io/v2/581335f71000004204abaf83+xsdffsdfsd",
      cache: false,
      data: {},
      async: true,
      success: function (data) {
	    _this.source = [];
	    for (let entry of data.contacts) {
		  _this.source.push(new Contact(entry.name, entry.phone_number, entry.address))

          //console.log('new entry :' +entry.name + '-' + entry.phone_number +' - '+ entry.address);
		}
		_this.filter();
      },
      error: function (err) {               
        console.error(err);
      }
    });
  }

  activate(model) {
      this.loadData();
  }

  searchStringChanged(newValue, oldValue) {
     this.filter();
  }

  clearFilter() {
	  this.searchString = '';
  }

  sort(field : int) {
    let fieldname = this.fieldnames[field];
    this.sortDetails.asc = this.sortDetails.fieldname === fieldname && !this.sortDetails.asc;
    this.sortDetails.fieldname = fieldname;

	let direction = this.sortDetails.asc ? 1 : -1;

	this.source.sort((left, right): number => {
	  if (left[fieldname] > right[fieldname]) return -1 * direction;
	  if (left[fieldname] < right[fieldname]) return 1 * direction;
	  return 0;
	}
	
	console.log(`Sort by : ${fieldname} (${direction})`);

	this.filter();
  }

  filter() {
    let filter = this.searchString.toLowerCase();
    //console.log('filtering entries:'+ filter);
	
    if (filter && filter !== "") {
      let items = [];
	  for (let entry of this.source) {
	    if (entry.name.toLowerCase().indexOf(filter) > -1 ||
	      entry.phone_number.toLowerCase().indexOf(filter) > -1 ||
	      entry.address.toLowerCase().indexOf(filter) > -1) {
	      items.push(entry);
          //console.log('matched entry :' +entry.name + '-' + entry.phone_number +' - '+ entry.address);
	    }
      }

	  this.items =  items;
	  return;
    }
	this.items =  this.source;
  }

  private getSortingClass(fieldname: string): string {
    return `${this.sortDetails.fieldname === fieldname ? 'active' : 'inactive'} ${this.sortDetails.asc ? 'asc' : 'desc'}`;
  }
}