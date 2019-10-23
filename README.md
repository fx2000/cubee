# cubee

Cubee is the fun story-making game you can play with the whole family. Roll the dice to get random story prompts and use them to craft your own tale of fantasy and adventure. With up to nine dice and 54 diferent combinations, the only limit is your imagination.

***cubee*** was developed using the MERN stack as part of the [Ironhack](https://www.ironhack.com/) developer bootcamp (WebDev-FT-092029) by [Daniel Duque](https://github.com/fx2000/) and [Inés Luna](https://github.com/InesLuna/).

## Minimum Viable Product

The __MVP__ will cover the following:

- __Landing Page:__ The landing page will present the app's concept and features, explain the nature of the game and show examples of users' creations.
- __Signup:__ A user will be able to register a new account.
- __Log In:__ A user can log in using their username and password.
- __Log out:__ A user can close their session at any time.
- __Login:__ A sign in form for existing users.
- __Profile:__ A profile page where a user can view/edit their personal details or delete their account completely.
- __Stories:__ One of the main pages of the application, it displays all user stories, allow sorting or searching by keywords or tags, upvoting or downvoting.
-__Create:__ The other main component of the app, it allows a user to randomly roll a set number of dice and create their own story.

Landing Page, Signup and Log in are public pages, all other sections are private and require an active user session.

## Backlog

- Story narration
- Commenting
- Adding favorite stories or users
- Sharing stories to external applications or other users
- Friend's list

## Data Structure

### Models

__User__
  - __id__ (unique, auto-generated)
  - __name__ (String, required)
  - __lastname__ (String, required)
  - __email__ (String, required, unique)
  - __username__ (String, required, unique)
  - __password__ (String, required)
  - __avatar__ (image)
  - __birthdate__ (date, required)
  
__Story__
  - __id__ (unique, auto-generated)
  - __dice__ (Array of objects, required)
  - __tags__ (array of strings, required)
  - __story__ (String, required)
  - __votes__ (Array of objects)

__Die__
  - __id__ (unique, auto-generated)
  - __name__ (String, required)
  - __tags__ (array of strings)

## Routes

- __/__
  - __/user__
    - /login
    - /signup
    - /profile
      - /update
      - /delete
  - __/stories__
    - /view
    - /delete
    - /vote
    - /create
  
  
## Links

### Trello
[Trello Kanban board](https://trello.com/b/RqyUq6AP/cubee)

### Git
[Gihub Repo URL](https://github.com/fx2000/cubee)
