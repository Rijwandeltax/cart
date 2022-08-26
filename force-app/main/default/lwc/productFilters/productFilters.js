import { LightningElement, wire, api, track } from "lwc";
import { getPicklistValues } from "lightning/uiObjectInfoApi";
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
// messageChannels
import { publish, MessageContext } from "lightning/messageService";
import PRODUCT_OBJECT from '@salesforce/schema/Product__c';
import FILTER_CHANNEL from "@salesforce/messageChannel/productFilterChannel__c";
import SIZE_FIELD from "@salesforce/schema/Product__c.Size__c";
import CATEGORY_FIELD from "@salesforce/schema/Product__c.Category__c";

export default class ProductFilters extends LightningElement {
	@track showModal = false;
    @track showLoading = false;
	minPrice;
	maxPrice;
	category;
	size;

	@wire(getObjectInfo, { objectApiName: PRODUCT_OBJECT })
    objectInfo;

    @wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: SIZE_FIELD})
    sizesPicklistValues;

	@wire(getPicklistValues, { recordTypeId: '$objectInfo.data.defaultRecordTypeId', fieldApiName: CATEGORY_FIELD})
    categoryPicklistValues;


	@wire(MessageContext)
	messageContext;

	handleChange(event) {
		this[event.target.name] = event.detail.value;
		console.log(event.detail.value);
	}

	publishChange() {
		const message = {
			filtersData: {
				category: this.category,
				minPrice: this.minPrice,
				maxPrice: this.maxPrice,
				size: this.size
			}
		};
		publish(this.messageContext, FILTER_CHANNEL, message);
	}

	@api openModal() {
        this.showModal = true;
    }

    closeModal(){
        this.showModal = false;
    }

	handleApplyFilter(){
		this.publishChange();
		this.closeModal();
	}
}