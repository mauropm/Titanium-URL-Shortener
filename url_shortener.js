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
 * Supported URL Shortening Services:
 * = bit.ly
 * = is.gd
 * = surl.me
 *
 * Sample:
 * 
 * // URL Shortener Library
 * Ti.include('libs/url_shortener/url_shortener.js');
 * // Create URL Shortener Instance
 * var url_shortener =  new url_shortener(SERVICE);
 * 
 * *** bit.ly ***
 * url_shortener.setAuth(login, api_key);
 * var short_url = url_shortener.shorten(URL_TO_SHORTEN);
 *
 * *** is.gd ***
 * var short_url = url_shortener.shorten(URL_TO_SHORTEN);
  *
 * *** surl.me ***
 * var short_url = url_shortener.shorten(URL_TO_SHORTEN);*
 */

var url_shortener = function(url_service)
{
	var url = null;
	
	switch(url_service)
	{
		case 'bit.ly':
			Ti.API.debug('Using bit.ly service');
			var req_url = 'http://api.bit.ly/v3/shorten';   // bit.ly request url for api
			var login   = null;                         	// bit.ly api login
			var apiKey  = null;                             // bit.ly api key
			var format  = null;	                            // Results Format
			
			this.setAuth = function(p_login, p_api_key)
			{
				login = p_login;
				apiKey = p_api_key;
			};
			
			this.shorten = function(p_url, p_format)
			{
				url = p_url;
				format = p_format;

				var results = this.makeRequest();
				results = this.processResults(results);
				var short_url = results.data.url;
				Ti.API.debug('Short URL: '+short_url);
				return short_url;
			};

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
			};

			this.processResults = function(pResults)
			{
				return eval('('+pResults+')');	// Eval the results
			};
			break;
		case 'is.gd':
			Ti.API.debug('Using is.gd service');
			var req_url = 'http://is.gd/api.php?longurl=';   // is.gd request url for api
			
			this.shorten = function(p_url)
			{
				url = p_url;

				var results = this.makeRequest();
				var short_url = results;
				Ti.API.debug('Short URL: '+short_url);
				return short_url;
			};
			
			this.makeRequest = function()
			{
				// Debug
				Ti.API.debug('Sending Requestion to: '+req_url+url);

				var client = Ti.Network.createHTTPClient();    // Create Titanium HTTP Client
				client.open('GET', req_url+url, false);
				client.send();                                 // Send request with parameters
				if (client.status == 200) {
					// Request Successful
					Ti.API.debug('Request to is.gd service successfull');
					Ti.API.debug(client.responseText);
				} else {
					// Oops, Something Happened
					Ti.UI.createAlertDialog({
						title: 'Error',
						message: 'Oops, Something Happened'
					}).show();
				}
				return client.responseText;
			};
			break;
		case 'surl.me':
			Ti.API.debug('Using surl.me service');
			var req_url = 'http://surl.me/api-create.php?url=';   // surl.me request url for api
			
			this.shorten = function(p_url)
			{
				url = p_url;

				var results = this.makeRequest();
				var short_url = results;
				Ti.API.debug('Short URL: '+short_url);
				return short_url;
			};
			
			this.makeRequest = function()
			{
				// Debug
				Ti.API.debug('Sending Requestion to: '+req_url+url);

				var client = Ti.Network.createHTTPClient();    // Create Titanium HTTP Client
				client.open('GET', req_url+url, false);
				client.send();                                 // Send request with parameters
				if (client.status == 200) {
					// Request Successful
					Ti.API.debug('Request to surl.me service successfull');
					Ti.API.debug(client.responseText);
				} else {
					// Oops, Something Happened
					Ti.UI.createAlertDialog({
						title: 'Error',
						message: 'Oops, Something Happened'
					}).show();
				}
				return client.responseText;
			};
			break;
	}
};