/*
 * Copyright 2010 Tim Pearson
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Currently this is setup to use the bit.ly service.  I may, in the future, look at adding other url shortening options.
 *
 * Sample:
 * 
 * // bit.ly Library
 * Ti.include('libs/bitly/bitly.js');
 * 
 * // Create bit.ly instance object
 * var bitly_url = new bitly_service(login,apiKey);
 *
 * // Call shorten method for the url you want to shorten
 * var short_url = bitly_url.shorten(URL_TO_SHORTEN);
 *
 */

// Configure your account information here
var req_url = 'http://api.bit.ly/v3/shorten';   // bit.ly request url for api
var login   = null;                         	// bit.ly api login
var apiKey  = null;                             // bit.ly api key

// bit.ly service object
var bitly_service = function (p_login, p_api_key)
{
	login = p_login		// bit.ly api login
	apiKey = p_api_key	// bit.ly api key
	var url = null;		// URL to shorten
	var format = null;	// Results Format
	
	this.shorten = function(p_url, p_format)
	{
		url = p_url;
		format = p_format;
		
		var results = this.makeRequest(p_url, p_format);
		results = this.processResults(results);
		var short_url = results.data.url;
		Ti.API.debug('Short URL: '+short_url);
		return short_url;
	}
	
	this.makeRequest = function()
	{		
		var params = {
			login:login,			// bit.ly login
			apiKey:apiKey,			// bit.ly api key
			longUrl:url,			// url to shorten
			format:format			// result format (json,xml,txt)
		};
		
		// Debug
		Ti.API.debug('Sending Requestion to: '+req_url+' with params: '+JSON.stringify(params));
		
		var client = Ti.Network.createHTTPClient();     // Create Titanium HTTP Client
		client.open('POST', req_url, false);            // Open bit.ly url with POST
		client.send(params);                            // Send request with parameters
		if (client.status == 200) {
			// Request Successful
			Ti.API.debug('Request to bit.ly service successfull');
		} else {
			// Oops, Something Happened
			Ti.UI.createAlertDialog({
				title: 'Error',
				message: 'Oops, Something Happened'
			}).show();
		}
		return client.responseText;
	}
	
	this.processResults = function(pResults)
	{
		return eval('('+pResults+')');	// Eval the results
	}
}