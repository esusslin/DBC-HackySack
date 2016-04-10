$(document).ready(function() {

  // // var location_arr = [];
  // // var location_arr = getUserLocation();

  // // console.log(location_arr);
  // // var place_id_arr = getNearbyPlaceId(location_arr);
  // // console.log(place_id_arr);
  
  // var recipe = getRecipe();

  // // var store_name_arr = [];

  // // for (var i = 0; i < place_id_arr.length; i++){
  // //   store_name_arr.push(getStore(place_id_arr[i]));
  // // }


  // console.log(recipe[0].ingredients[2]);


  // for (var i = 0; i < recipe[0].ingredients.length; i++){
  //   debugger;
  //   total_cost += getPrice(recipe[0].ingredients[i]);
  // }

  // 

  // console.log(total_cost);

  // debugger;


  submitRequest();

});


var submitRequest = function(){

  $( '#request' ).on( 'submit', function(e){
    
    var recipe = [];
    var location_arr = [];
    var store_name_arr = [];

    e.preventDefault();
    var food = $( '#query' ).val();
    recipe = getRecipe(food);

    for (var i=0;i<recipe.length;i++){
      var total_cost = 0;

      $( '.container' ).append(`<h1>${recipe[i].label}</h1>`);
      $( '.container' ).append(`<img src="${recipe[i].image}">`);
      for (var j=0;j<recipe[i].ingredients.length;j++){
        $( '.container' ).append(`<p>${recipe[i].ingredients[j]}</p>`);
      }

      $( '.container' ).append(`<a href="${recipe[i].url}">Directions here</a>`);


      for (var x = 0; x < recipe[i].ingredients.length; x++){
        total_cost += getPrice(recipe[i].ingredients[x]);
      }

      total_cost.toFixed(2);

      $( '.container' ).append(`<p>Approx total cost: ${total_cost}</p>`);
      $( '.container' ).append(`<br>`);

    }



    location_arr = getUserLocation();
    var place_id_arr = getNearbyPlaceId(location_arr);
    for (var i = 0; i < place_id_arr.length; i++){
      store_name_arr.push(getStore(place_id_arr[i]));
    } 


    $( '.container' ).append(`<h3>Nearby Grocery Stores</h3>`);

    for (var j = 0; j < store_name_arr.length; j++){
      $( '.container' ).append(`<p>${store_name_arr[j]}</p>`);
    }
    debugger;

  });



};

















var getUserLocation = function(){

  var location_arr = [];

  var api_request = "https://www.googleapis.com/geolocation/v1/geolocate?"
  var api_key = ""
  var complete_url = `https://www.googleapis.com/geolocation/v1/geolocate?key=${key_here}`
  var request = $.ajax({
    url: complete_url,
    type: "post",
    async: false
  })
  .success(function(data){
    location_arr.push(data.location.lat);
    location_arr.push(data.location.lng);
  });

  // request.done(function(json){
  // }); 

    // $.post( complete_url, function( data ) {
    //   location_arr.push(data.location.lat);
    //   location_arr.push(data.location.lng);
    // }); 

    // debugger;

    return location_arr;

};

var getNearbyPlaceId = function(location_arr){
  var place_id_arr = [];

  var api_request = "https://maps.googleapis.com/maps/api/place/radarsearch/json?"
  var location_query = `location=${location_arr[0]},${location_arr[1]}`
  var option = "&radius=700&type=grocery_or_supermarket&"
  var key = "key="


  var complete_url = api_request + location_query + option + key;
  
  // $.getJSON( complete_url, function( data ){
  //   console.log(data);
  //   debugger;
  // });

 var request = $.ajax({
  url: complete_url,
  type: "get",
  async: false,
  })
  .success(function(data){
    for (var i = 0; i< data.results.length; i++){
      place_id_arr.push(data.results[i].place_id);
    }


  });

  return place_id_arr;

};



var getRecipe = function(food){

  var recipe = [];

  var api_request = `https://api.edamam.com/search?q=${food}&app_id=a9cbf216&app_key=`

  var request = $.ajax({
  url: api_request,
  type: "get",
  async: false,
  })
  .success(function(data){
    for (var i = 0; i < data.hits.length; i++){
      if (data.hits[i].recipe.ingredients.length < 7){
        recipe[i] = {};
        recipe[i].label = data.hits[i].recipe.label;
        recipe[i].image = data.hits[i].recipe.image;
        recipe[i].ingredientLines = data.hits[i].recipe.ingredientLines;
        recipe[i].url = data.hits[i].recipe.url;

        recipe[i].ingredients = [];

        for (var j = 0; j< data.hits[i].recipe.ingredients.length; j++){
          
          recipe[i].ingredients[j] = data.hits[i].recipe.ingredients[j].food;
   
          // data.hits[i].recipe.ingredients[j].quantity;
        }
      }

    }

  });

  var final_recipe = [];

  for (var i = 0; i < recipe.length; i++){
    if (recipe[i] != null){
      final_recipe.push(recipe[i]);
    }
  }
  return final_recipe;

};


var getStore = function(place_id){
  var query = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=`

  var name;

  var request = $.ajax({
    url: query,
    type: "get",
    async: false,
  })
  .success(function(data){

    name = data.result.name;

  })
  .fail(function(){

    console.log("failed");

  });


  return name;
};


var getPrice = function(food){
 var count = 0;
 var query = `http://www.supermarketapi.com/api.asmx/COMMERCIAL_SearchByProductName?APIKEY=${key_here}&ItemName=${food}`
 
 var sum = 0;
 

 var request = $.ajax({
  url: query,
  type: "get",
  async: false,
  })
  .done(function(data){


    var json = xmlToJson(data);





      if (Array.isArray(json.ArrayOfProduct_Commercial.Product_Commercial) == true){
        if (json.ArrayOfProduct_Commercial.Product_Commercial.length < 3){
          count = json.ArrayOfProduct_Commercial.Product_Commercial.length;
        } else {
          count = 3;
        }
      }else{
        count = 1;
      }


      if (Array.isArray(json.ArrayOfProduct_Commercial.Product_Commercial) == true){

        for (var j=0; j<count; j++){
          sum += Number(json.ArrayOfProduct_Commercial.Product_Commercial[j].Pricing['#text']);
        }
      }else if (json.ArrayOfProduct_Commercial.Product_Commercial.Pricing["#text"] != "NOPRICE"){
        sum = Number(json.ArrayOfProduct_Commercial.Product_Commercial.Pricing['#text']);
        count = 1;
      }else{
        sum = 0;
      }



  })
  .fail(function(){

    console.log("failed");

  });

  return (sum/count)*0.8;

};























function xmlToJson(xml) {
  
  // Create the return object
  var obj = {};

  if (xml.nodeType == 1) { // element
    // do attributes
    if (xml.attributes.length > 0) {
    obj["@attributes"] = {};
      for (var j = 0; j < xml.attributes.length; j++) {
        var attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType == 3) { // text
    obj = xml.nodeValue;
  }

  // do children
  if (xml.hasChildNodes()) {
    for(var i = 0; i < xml.childNodes.length; i++) {
      var item = xml.childNodes.item(i);
      var nodeName = item.nodeName;
      if (typeof(obj[nodeName]) == "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof(obj[nodeName].push) == "undefined") {
          var old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
};




