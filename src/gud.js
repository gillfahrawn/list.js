import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation, Routes, Route, Link } from 'react-router-dom';
import { makeId, getLocalItems, useOutsideAlerter, arraysEqual } from './utils.js';
import './home.css';
import './edit.css';
import './dropdown1.css';
import './dropdown2.css';
var outClickedBefore = false;
var outClicked = false;
var outUpBefore = false;
var outUpped = false;
var ellipsisCount = 0;
//Fahrawn Gill, 3/24/22

function App() {
  return ( 
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/newItem" element={<NewItem />} />
      </Routes>
    </div>
  );
}

function Home() {
  const [items, setItems] = useState(getLocalItems);

  const removeCreateItem = () => {
    setItems('');
  };

  const removeItem = (index) => {
    let divord = localStorage.getItem('divorder');
    let divord_arr = divord.split(',');

    let rmItem = localStorage.getItem(divord_arr[index]);
    localStorage.removeItem(divord_arr[index]);
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);

    let divord_replace = "";
    if (divord[0] == divord_arr[index]) { /*if remove-item == first item in divord*/
      if(divord_arr.length == 1) {/*no commas if divord has 1 item*/
        divord_replace = divord.replace(String(divord_arr[index]), "");
      }
      else {/*removing commas*/
        divord_replace = divord.replace(String(divord_arr[index]) + ',', "");
      }
    }
    else { 
      divord_replace = divord.replace(',' + String(divord_arr[index]), "");
    }
   
    localStorage.setItem('divorder', divord_replace);
  };
 
  return (
    <div className="Home">
      <Title/>
      <div className="item-list">
        {(localStorage.length==0 || localStorage.getItem('divorder')=='') 
          && <CreateAList item={{content: "Create a list"}} remove={removeCreateItem}/>}
        {localStorage.getItem('divorder')!='' && items.map((item, index) => (
          <Item 
            key={index}
            index={index}
            item={item}
            removeItem={removeItem}
          />
        ))}
      </div>
    </div>
  )
};


function Title() {
  const [pencilColor, setPencilColor] = useState(
    [
      "default", '/images/HomePencilDefault-Hover.svg'
    ]);

  const addHoverShadow = (e) => {
    e.target.style.backgroundColor = '#F4F4F4';
  };

  const removeHoverShadow = (e) => {
    e.target.style.backgroundColor = '#ffff';  
    setPencilColor(["default", '/images/HomePencilDefault-Hover.svg']);  
  };


  const bluePencilToggle = () =>  {
    setPencilColor(["blue", '/images/HomePencilPressed.svg']);  
  };

  let navigate = useNavigate(); 
  const newItemRoute = () =>{ 
    let path = '/newItem'; 
    navigate(path);
  };

  return (
    <div className="title">
      <div className="top-spacer"></div>
      <div className="line-break"></div>
      <div className="spacer1" style={{order: 1}}></div>
      <img className="propic" src="images/Blueberries.png" alt=""/>
      <div className="spacer2" style={{order: 3}}></div>
      <div className="lists">
        <p>Lists</p>
      </div>
      <button className="pencilFrame" type="submit" style={{backgroundImage:`url(${pencilColor[1]})`}}
        onMouseOver={addHoverShadow} 
        onMouseLeave={removeHoverShadow}
        onMouseDown={bluePencilToggle}
        onClick={newItemRoute}>
      </button>

      <div className="spacer3" style={{order: 6}}></div>
      <div className="line-break"></div>
      <div className="bottom-spacer"></div>
    
    </div>
  );
};


function CreateAList({item, remove}) {
  const [plusColor, setPlusColor] = useState(['#FFFFFF', 'none']);

  const addHoverShadow = (e) => {
    const newState = '0px 2px 10px rgba(0, 0, 0, 0.08)';
    setPlusColor([plusColor[0], newState]);
  };

  const removeHoverShadow = (e) => { 
    const color = '#FFFFFF'
    const shadow  = 'none';
    setPlusColor([color, shadow]);  
  };

  const downShadowToggle = (e) =>  {
    const color = '#F4F4F4';
    const shadow = '0px 2px 10px rgba(0, 0, 0, 0.08)';
    setPlusColor([color, shadow]);  
  };

  let navigate = useNavigate(); 
  const newItemRoute = () =>{ 
    let path = '/newItem'; 
    remove();
    navigate(path);
  };
  return (
    <div className="itemPad">
      <button className="plusItem" 
        style={{order: 1, backgroundColor: plusColor[0], boxShadow: plusColor[1]}} type="submit"
              onMouseOver={addHoverShadow} 
              onMouseLeave={removeHoverShadow}
              onMouseDown = {downShadowToggle}
              onClick={newItemRoute}>Create a list
      </button>
    </div>
  );
};


const useForceUpdate = () => {
	const [count, setCount] = useState(0)
	
	const increment = () => setCount(prevCount => prevCount + 1)
	return [increment, count]
}


function Item({ item, index, removeItem }) {
  const [forceUpdate] = useForceUpdate()
  const wrapperRef = useRef(null);  //used in itemClickCheck below, for detecting outside clicks
  const [itemColor, setItemColor] = useState(['#FFFFFFF', 'none']);
  const [ellipsisDown, setEllipsisDown] = useState(false);
  const [ellipsisHover, setEllipsisHover] = useState(false);
  const [ellipsisToggle, setEllipsisToggle] = useState(false);
  const [ellipsisColor, setEllipsisColor] = useState(
    [
      "default", '/images/EllipsisDefault&Hover.svg', 'none', 'transparent'
    ]);
  const [btnColor, setBtnColor] = useState(
    [
      {"edit" : ["default", '#FFFFFF', "/images/EditPencilDefault-Hover.svg", '/images/BlackEditTxt.svg']}, 
      {"delete" : ["default", '#FFFFFF', "/images/DeleteTrashDefault-Hover.svg", '/images/BlackDeleteTxt.svg']}
    ]);

  useEffect(() => console.log("re-render bc ellipsisToggle changed:", ellipsisToggle), [ellipsisToggle]);


  const editPencil_addHover = (e) => {
    const newState = [{"edit" : ["hover", '#F4F4F4', "/images/EditPencilDefault-Hover.svg", '/images/BlackEditTxt.svg']}, btnColor[1]];
    setBtnColor(newState);
  };

  const editPencil_removeHover = (e) => {
    const newState = [{"edit": ["default", '#FFFFFF', "/images/EditPencilDefault-Hover.svg", '/images/BlackEditTxt.svg']}, btnColor[1]];
    setBtnColor(newState);
  };

  const editPencil_blueToggle = (e) =>  {
    const newState = [{"edit": ["clicked", '#F4F4F4', "/images/EditPencilPressed.svg", '/images/BlueEditTxt.svg']}, btnColor[1]];
    setBtnColor(newState);
    setTimeout(() => {  editAndDeleteRoute(e); }, 50);
  };

  const deleteTrash_addHover = (e) => {
    const newState = [btnColor[0], {"delete" : ["hover", '#F4F4F4', "/images/DeleteTrashDefault-Hover.svg", '/images/BlackDeleteTxt.svg']}];
    setBtnColor(newState);
  };

  const deleteTrash_removeHover = (e) => {
    const newState = [btnColor[0], {"delete": ["default", '#FFFFFF', "/images/DeleteTrashDefault-Hover.svg", '/images/BlackDeleteTxt.svg']}];
    setBtnColor(newState);
  };

  const deleteTrash_redToggle  = (e) =>  {
    const newState = [btnColor[0], {"delete": ["clicked", '#F4F4F4', "/images/DeleteTrashPressed.svg", '/images/RedDeleteTxt.svg']}];
    setBtnColor(newState);
    setTimeout(() => {  editAndDeleteRoute(e); }, 50);
  };

  const ellipsisHoverShadow = (e) => {
    console.log("ellipsisHoverShadow")
    const newState = ["hover", '/images/EllipsisDefault&Hover.svg', 'none', '#F4F4F4'];
    setEllipsisColor(newState);
  };

  const removeEllipsisShadow = (e) => {
    const newState = ["default", '/images/EllipsisDefault&Hover.svg', 'none', 'transparent'];
    setEllipsisColor(newState);
  };


  const addBlueEllipsis = (e) =>  {
    if (ellipsisCount > 0) {
      e.target.blur()
      ellipsisCount = 0;
    }
    console.log( "ellipccount is" + ellipsisCount);

    console.log("ellipsisDown");
    setEllipsisDown(true);
    console.log(outClicked + " < outClicked on EllipsisDown");
    e.stopPropagation(); //stops item from changing COLOR when clicking ellipses
    const shadow = 'none';
    const color = '#FFFFFF';
    setItemColor([color, shadow]);

    console.log("ELLIPSIS-DOWN BLUE: outUpBefore is : " + outUpBefore);
    console.log("ELLIPSIS-DOWN BLUE: outUpBefore is : " + outUpped);


    const newState = ["blue", '/images/EllipsisPressed.svg', 'none', '#F4F4F4'];
    setEllipsisColor(newState);  
    // setTimeout(() => {  editAndDeleteRoute(e); }, 50);
  };

  const addItemHoverShadow = (e) => {
    const shadow = '0px 2px 10px rgba(0, 0, 0, 0.08)';
    setItemColor([itemColor[0], shadow]);
  };

  const removeBlueEllipsis = (e) => {
    const newState = ["default", '/images/EllipsisDefault&Hover.svg', 'none', 'transparent'];
    setEllipsisColor(newState);
  };

  const removeItemShadowAndColor = (e) => { 
    // e.stopPropagation();
    // if (ellipsisToggle) {
    //   e.target.blur();
    // }
    const shadow = 'none';
    const color = '#FFFFFF';
    setItemColor([color, shadow]);  
  };

  const downItemColorToggle = (e) =>  {
    const color = '#F4F4F4';
    // e.target.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.08)';
    setItemColor([color, itemColor[1]]);  
  };
  
  let navigate = useNavigate(); 
  const newItemRoute = (e) =>{ 
    console.log("NEW ITEM ROUTE");
    let path = '/newItem'; 
    navigate(path);
  // console.log(index, item);
  };

  useOutsideAlerter(wrapperRef, outClickedBefore, outClicked, 
    outUpBefore, outUpped, setEllipsisToggle, ellipsisToggle, ellipsisCount);

  const itemClickCheck = (e) => {
    // console.log("regItemCapture - ELLIPSES TOGGLE STATE IS" + ellipsisDown);
    console.log(e.target.className + " < is the target class");
    console.log(ellipsisToggle + " < is ellipsisToggle in itemClickCheck");
    // if (ellipsisToggle) {
    //   const shadow = 'none';
    //   const color = '#FFFFFF';
    //   setItemColor([color, shadow]); 
    // }
    let target = e.target.className;
    if (ellipsisDown && target =='regItem') { //to prevent down on ellipses > up on regItem from registering as a click on regItem
      console.log("IN IF")
      const shadow = 'none';
      const color = '#FFFFFF';
      setItemColor([color, shadow]); 
      e.preventDefault();
      setEllipsisToggle(!ellipsisToggle);
      if (!ellipsisToggle) {
        e.stopPropagation();
      } 
      forceUpdate();
    }
  }
  



  const padClickCheck = (e) => { //required because onClick on itemPad doesn't register as an outClick
      console.log("TARGET IS REGITEM!!!!!*******");
      setEllipsisToggle(false);
  }


  const toggleDropdown = (e) => {  
    if (outClicked && ellipsisToggle) {
      console.log("IF STATEMENT");
      e.target.blur();
      ellipsisCount++;
      setEllipsisToggle(true);
      forceUpdate();
    }
    else if (outClicked && !ellipsisToggle) {
      console.log("ELSE IF 1");
      setEllipsisToggle(true);
      forceUpdate();
    }
    else if (!outClicked && ellipsisToggle) {
      console.log("ELSE IF 2");
      e.target.blur();
      ellipsisCount++;
      setEllipsisToggle(false);
      forceUpdate();
    }
    else if (!outClicked && !ellipsisToggle) {
      setEllipsisToggle(true);
      forceUpdate();
    }


    const toggle = !ellipsisToggle;
    console.log("toggle after handling is: " + ellipsisToggle);
    // setEllipsisToggle(toggle);
    e.stopPropagation(); /* < WORKS: PREVENTS ELLIPSES FROM GOING TO EDIT PAGE 
                                      (i.e. prevents click from propagating to parent div)*/
  }

  const editAndDeleteRoute = (e) =>{ 
    console.log('EDIT ROUTE CLICKED');
    let target = e.target.className;
    console.log(target + " IS THE TARGET");
    if (target == 'deleteText' || target == 'deleteTrash_img' ||
        target == 'deleteImg' || target == 'deleteBtn') {
          deleteUpdate();
          return;
    }
    if (target == 'editText' || target == 'editPencil_img' || 
        target == 'editImg' || target == 'editBtn') {
      let path = '/newItem'; 
      console.log("IF-EDIT NAV");
      console.log(item + " < IS THE ITEM (IN editAndDeleteRoute)");
      navigate(path, {state: {content : item.content, index : index}});
    }

    let path = '/newItem'; 
    console.log("2nd EDIT NAV");
    console.log(item + "< CURR ITEM");
    navigate(path, {state: {content : item.content, index : index}});
  };

  const deleteUpdate = () => {
    console.log("DELETE UPDATE ENTERED");
    let divord = localStorage.getItem('divorder');
    console.log("INDEX OF DELETE-ITEM IS: " + index);
    let divord_arr = divord.split(',');
    localStorage.removeItem(divord_arr[index]);
    removeItem(index);
  }
  
  const dropHoverCheck = (e) => {
    console.log("DROP HOVERED SUCCES");
    setEllipsisToggle(false);
    forceUpdate();
  }

  return (
        <div ref={wrapperRef}>
          <div className="itemPad" id="dropdown" data-dropdown>

            <div className="regItem" style={{backgroundColor: itemColor[0],
              boxShadow: itemColor[1]}} type="submit"
                  onMouseOver={addItemHoverShadow} 
                  onMouseLeave={removeItemShadowAndColor}
                  onMouseDown = {downItemColorToggle}
                  onClickCapture = {itemClickCheck}
                  onClick={editAndDeleteRoute}>
                  <div className="contentContainer">
                    <p className="content" id="content">
                      {item.content.split('\n')[0]}</p>
                  </div>
                  <button className="ellipsis" 
                          style={{backgroundImage:`url(${ellipsisColor[1]})`, 
                                  boxShadow: ellipsisColor[2], 
                                  backgroundColor: ellipsisColor[3]}}
                          onMouseOver={ellipsisHoverShadow} 
                          onMouseLeave={removeEllipsisShadow}
                          onMouseUp={removeBlueEllipsis}
                          onMouseDown={addBlueEllipsis}
                          onClick={toggleDropdown} id="ellipsis">
                    </button>
                    <div className="dropdown-menu" id="d-menu"
                        onMouseOverCapture={dropHoverCheck}
                        onClick={editAndDeleteRoute}>
                      <div className="dropItem1">
                        <button className="editBtn" id="d-menu" style={{order: 1, backgroundColor: btnColor[0]["edit"][1]}} type="submit"
                                onMouseOver={editPencil_addHover} 
                                onMouseLeave={editPencil_removeHover}
                                onMouseDown={editPencil_blueToggle}
                                onClick={editAndDeleteRoute}> 
                          <span className="editImg" id="d-menu">
                            <img className="editPencil_img" id="d-menu" src={btnColor[0]["edit"][2]}></img>
                          </span>
                          <span><img className="editText" id="d-menu"
                                style={{backgroundColor: btnColor[0]["edit"][1]}}
                                src={btnColor[0]["edit"][3]}></img></span>
                        </button>
                      </div>
                      <div className="dropItem2">
                        <button className="deleteBtn" id="d-menu" style={{order: 2, backgroundColor: btnColor[1]["delete"][1]}} type="submit"
                                onMouseOver={deleteTrash_addHover} 
                                onMouseLeave={deleteTrash_removeHover}
                                onMouseDown={deleteTrash_redToggle}
                                onClick={deleteUpdate}>
                          <span className="deleteImg" id="d-menu">
                            <img className="deleteTrash_img" id="d-menu" src={btnColor[1]["delete"][2]}></img>
                          </span>
                          <span><img className="deleteText" id="d-menu"
                                style={{backgroundColor: btnColor[1]["delete"][1]}}
                                src={btnColor[1]["delete"][3]}></img></span>
                        </button>
                      </div>
                    </div>
            </div>
          </div>
        </div>
  );
};



function NewItem(props) {
  const { state } = useLocation();
  console.log(state + " WAS PASSED FROM EDITBTN AS ROUTE PROPS");
  const [btnColor, setBtnColor] = useState(
    [
      {"cancel" : ["default", '#505050', "/images/LeftArrowDefault.svg"]}, 
      {"done" : ["default", '#505050']}
    ]);
  const [inText, setInText] = useState(state == null ? "" : state.content);

  const addHoverCancel = (e) => {
    let newState = [{"cancel" : ["hover", '#242424', "/images/LeftArrowHover.svg"]}, btnColor[1]];
    setBtnColor(newState);
  };

  const removeHoverCancel = (e) => {
    let newState = [{"cancel": ["default", '#505050', "/images/LeftArrowDefault.svg"]}, btnColor[1]];
    setBtnColor(newState);
  };

  const blueCancelToggle = () =>  {
    let newState = [{"cancel": ["clicked", '#2FE6FF', "/images/LeftArrowPressed.svg"]}, btnColor[1]];
    setBtnColor(newState);
  };

  const addHoverDone = (e) => {
    let newState = [btnColor[0], {"done" : ["hover", '#242424']}];
    setBtnColor(newState);
  };

  const removeHoverDone = (e) => {
    let newState = [btnColor[0], {"done" : ["default", '#505050']}];
    setBtnColor(newState);
  };

  const blueDoneToggle = () =>  {
    let newState = [btnColor[0], {"done" : ["clicked", '#2FE6FF']}];
    setBtnColor(newState);
  };

  let navigate_home = useNavigate(); 
  const cancelRoute = () =>{ 
    let path = '/'; 
    navigate_home(path);
  };

  const doneRoute = () =>{ 
    if (state) { //remove item that originally was passed
      let divord = localStorage.getItem('divorder');
      let divord_arr = divord.split(',');
  
      let rmItem = localStorage.getItem(divord_arr[state.index]);
      localStorage.removeItem(divord_arr[state.index]);
 
      let divord_replace = "";
      if (divord[0] == divord_arr[state.index]) { /*if remove-item == first item in divord*/
        if(divord_arr.length == 1) {/*no commas if divord has 1 item*/
          divord_replace = divord.replace(String(divord_arr[state.index]), "");
        }
        else {/*removing commas*/
          divord_replace = divord.replace(String(divord_arr[state.index]) + ',', "");
        }
      }
      else { 
        divord_replace = divord.replace(',' + String(divord_arr[state.index]), "");
      }
 
      localStorage.setItem('divorder', divord_replace);
    }
    if (inText) {
      let itemName = (makeId());
      let divord = localStorage.getItem('divorder');
      console.log("DIVORD IS: " + divord + "HERE WITH TYPE: " + typeof(divord));

      /*case: divord is empty (itemName is 0 and want 1) */
      if (divord == null) {
        console.log("GOT INSIDE");
        localStorage.setItem('divorder', String(itemName+1)); 
        itemName=1;
      }
      /*case: create-a-list button clicked (init divord at key 0)*/
      else if (divord == "") {
        localStorage.setItem('divorder', String(itemName));
      }
      /*case: other (any key added to divord > 1st needs comma)*/
      else {
        divord = divord + ',' + String(itemName);
        localStorage.setItem('divorder', divord);
      }
      localStorage.setItem(itemName, inText);
      let path = '/'; 
      navigate_home(path);
    }
    else {
      cancelRoute();
    }
  };

  return (
    <>
      <div className="top-spacer" id="whitespace"></div>
      <div className="cancelDone">
        <div className="cancel">
          <div className="spacer4" style={{order: 0}}></div>
          <button className="cancelBtn" style={{order: 1}} type="submit"
                  onMouseOver={addHoverCancel} 
                  onMouseLeave={removeHoverCancel}
                  onMouseDown={blueCancelToggle}
                  onClick={cancelRoute}>
            <span className="cancelImg">
              <img className="arrow_img" src={btnColor[0]["cancel"][2]}></img>
            </span>
            <span className="cancelText" 
                  style={{color: btnColor[0]["cancel"][1]}}>Cancel</span>
          </button>
        </div>
        <div className="done">
          <button className="doneBtn" style={{order: 1}} type="submit"
                  onMouseOver={addHoverDone} 
                  onMouseLeave={removeHoverDone}
                  onMouseDown={blueDoneToggle}
                  onClick={doneRoute}>
            <span className="doneText" 
                  style={{color: btnColor[1]["done"][1]}}>Done</span>
          </button>
          <div className="spacer4" style={{order: 4}}></div>
        </div>
        <div className="line-break"></div>
      </div>
      <div className="bottom-spacer"></div>
      <form className="itemForm">
        <textarea autoFocus spellCheck="false" id="area1" rows="15" cols="60" placeholder="List title"
        type="text" value={inText} onChange={e=>setInText(e.target.value)}>
        </textarea>
      </form>
    </>
  );
}

export default App;
