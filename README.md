# HW Manager
![hyperapp](https://img.shields.io/badge/Front--end-hyperapp-00aaff.svg) ![PHP+SQLite3](https://img.shields.io/badge/Server(demo)-PHP%2BSQLite3-6699ff.svg) ![Express(node)+mongodb](https://img.shields.io/badge/Server(hw__manager__api)-Express(node)%2Bmongodb-6699ff.svg)  
:books: < **hello!**  
*manage and share homeworks info to classmate.*  
> private work, not generally specification

## Build
```sh
git clone git@github.com:mochiya98/hw_manager.git
cd hw_manager
npm i
npm run build
```

## Demo
[HW Manager](https://github.m98.be/hw_manager/)

### Demo Server Environment
PHP+SQLite3 RESTful API  
(GET/POST only, using _method attribute alternatively)  
>why php?  
>that is the specification of the hosting server...  

BUT, Express(node)+mongodb version is comming!  
please lookup [mochiya98/hw_manager_api](https://github.com/mochiya98/hw_manager_api).  

## Calling API Specification
> not all (please lookup [mochiya98/hw_manager_api](https://github.com/mochiya98/hw_manager_api))
### [GET] /hws
get all homeworks.

### [PUT] /hws/:hwid
add and edit a homework.

### [DELETE] /hws/:hwid
delete homeworks.

### [PUT] /hws/:hwid/comments/:comment_id
add a comment to a homework.
