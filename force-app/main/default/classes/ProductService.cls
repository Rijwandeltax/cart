public with sharing class ProductService {
	@AuraEnabled(cacheable=true)
	public static List<Product__c> getProducts(String name,	FilterWrapper filtersData) {
		String nameLike = '%' + name + '%';

		String query = 'SELECT Name, Image_URL__c, Price__c, Brand__c, Size__c, Category__c FROM Product__c WHERE Name like :nameLike';

		System.debug('name ' + name);
		System.debug('filtersData ' + filtersData);
		if (filtersData != null) {

			if (filtersData.minPrice != null) {
				Decimal minPrice = filtersData.minPrice;
				query += ' AND Price__c >= :minPrice';
			}

			if (filtersData.maxPrice != null) {
				Decimal maxPrice = filtersData.maxPrice;
				query += ' AND Price__c <= :maxPrice';
			}

			if (String.isNotBlank(filtersData.category)) {
				String category = filtersData.category;
				query += ' AND Category__c = :category';
			}

			if (String.isNotBlank(filtersData.size)) {
				String size = filtersData.size;
				query += ' AND Size__c = :size';
			}
		}
		return (List<Product__c>) Database.query(query);
	}

	@AuraEnabled
	public static String createOrder(object data){
		List<ProductOrderWrapper> productData = (List<ProductOrderWrapper>) JSON.deserialize(JSON.serialize(data), List<ProductOrderWrapper>.class);

		Order__c ord = new Order__c();
		insert ord;

		List<Order_Line_Item__c> oliList = new List<Order_Line_Item__c>();

		for(ProductOrderWrapper product : productData){
			Order_Line_Item__c oli = new Order_Line_Item__c();
			oli.Order__c = ord.Id;
			oli.Product__c = product.Id;
			oli.Price__c = product.price;
			oli.Quantity__c = product.quantity;
			oliList.add(oli);
		}

		insert oliList;
		
		return ord.Id;
	}

	public class FilterWrapper {
		@AuraEnabled
		public Decimal minPrice { get; set; }

		@AuraEnabled
		public Decimal maxPrice { get; set; }

		@AuraEnabled
		public String category { get; set; }

		@AuraEnabled
		public String size { get; set; }
	}

	public class ProductOrderWrapper {
		@AuraEnabled
		public String Id;

		@AuraEnabled
		public Decimal price;

		@AuraEnabled
		public Decimal totalPrice;

		@AuraEnabled
		public Integer quantity;

		@AuraEnabled
		public String Name;
	}
}