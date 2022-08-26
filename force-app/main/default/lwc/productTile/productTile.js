import {LightningElement, api, wire} from "lwc";
// messageChannels
import { publish, MessageContext } from "lightning/messageService";
import CART_CHANNEL from "@salesforce/messageChannel/productAddRemoveCartChannel__c";

export default class ProductTile extends LightningElement {
	@api product;

	@wire(MessageContext)
	messageContext;

	publishChange(cartData, cartAction) {
		const message = {
			cartData: cartData,
			action:{
				cartAction : cartAction
			}
		};
		publish(this.messageContext, CART_CHANNEL, message);
	}

	@api
	get addedToCart() {
		return this.isAddedToCart;
	}
	set addedToCart(value) {
		this.isAddedToCart = value;
	}

	@api
	get defaultQuantity() {
		return this.quantity;
	}

	set defaultQuantity(value) {
		this.quantity = value;
	}

	quantity = 1;
	isAddedToCart;

	handleAddToCart() {
		this.isAddedToCart = true;
		let cartData = {
			productId: this.product.Id,
			Id : this.product.Id,
			quantity: this.quantity,
			Name : this.product.Name,
			price : this.product.Price__c,
			totalPrice : (this.quantity * this.product.Price__c),
		}
		this.publishChange(cartData, 'Add');
	}

	handleRemoveFromCart() {
		this.isAddedToCart = false;
		let cartData = {
			productId: this.product.Id,
		}
		this.publishChange(cartData, 'Remove');
		
	}

	handleChange(event) {
		this.quantity = event.target.value;
	}

	get backgroundStyle() {
		return `background-image:url(${this.product.Image_URL__c})`;
		//return `background-image:url('https://i.imgur.com/KLe3XF0.jpg')`;
	}

	get totalPrice() {
		return this.quantity * this.product.Price__c;
	}
}