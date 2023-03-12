For this project I created an auction website for potatoes using Django.

a demo of all the featuers can be viewed here: https://youtu.be/8MXKsPDCE7M

I've created 6 models (i.e. tables, since Django creates tables from the models automatically)
1. User
2. Category
3. Bid
4. Listing
5. User_comments
6. Watchlist

- Users can visit a page to create a new listing. They can specify a title for the listing, a text-based description, and what the starting bid should be. 
- Users can also optionally provide a URL for an image for the listing.
- The default route lets users view all of the currently active auction listings. For each active listing, this page displays the title, description, current price, and photo (if one exists for the listing).
- Clicking on a listing takes users to a page specific to that listing. On that page, users can view all details about the listing, including the current price for the listing.
  - If the user is signed in, the user can add the item to their “Watchlist.” If the item is already on the watchlist, the user can remove it.
  - If the user is signed in, the can bid on the item. The bid must be at least as large as the starting bid, and must be greater than any other bids that have been placed (if any). If the bid doesn’t meet those criteria, the user is presented with an error.
  - If the user is signed in and is the one who created the listing, they can “close” the auction from this page, which makes the highest bidder the winner of the auction and makes the listing no longer active.
  - If a user is signed in on a closed listing page, and the user has won that auction, the page says so.
  - Users who are signed in can add comments to the listing page. The listing page should display all comments that have been made on the listing.
- Users who are signed in can visit a Watchlist page, which displays all of the listings that a user has added to their watchlist. Clicking on any of those listings takes the user to that listing’s page.
- Users can visit a page that displays a list of all listing categories. Clicking on the name of any category takes the user to a page that displays all of the active listings in that category.

here are some screenshots:

<img width="1126" alt="image" src="https://user-images.githubusercontent.com/22756687/224579113-caafe506-9a5a-43b9-96ea-28a4563cdf5b.png">

<img width="1226" alt="image" src="https://user-images.githubusercontent.com/22756687/224579147-a631c5b4-98c1-4a4d-93d7-13ed9953e013.png">

<img width="1225" alt="image" src="https://user-images.githubusercontent.com/22756687/224579173-740044c5-4938-4b94-84d2-7085d7c8b111.png">


