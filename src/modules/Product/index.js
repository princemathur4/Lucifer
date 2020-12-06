import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import "./style.scss";
import { getParameterByName } from "../../utils/Browser";
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import Spinner from "../../components/Spinner";
import { toJS } from "mobx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { titleCase, roundOffNumber } from "../../utils/utilFunctions";
import { fetchCartItems } from "../../utils/ProductUtils";
import findindex from "lodash.findindex";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";

class Product extends React.Component {
    constructor(props) {
        super(props);
        this._id = "";
        this.state = {
            productLoaderActive: true,
            activeSize: "",
            sizeSelectWarning: false,
            isAddingToCartLoading: false,
            isSubmitLoading: false,
            pincode: "",
            pincodeValidationMsg: "",
            pincodeValidationStatus: "",
            pincodeCheckLoading: false,
            activeImageindex: 0,
            loginModalActive: false,
            mode: "view",
            responseText: "",
            responseType: "error",
            sizeOptions: [],
            stock: 0,
            productInfoCount: 0,
            productInfoList: [],
            payload: {},
            imageItems: [],
            errors: {
                title: false,
                description: false,
                color: false,
                color_code: false,
                fit: false,
                fabric: false,
                title: false,
            },
        };
    }

    componentDidMount() {
        this.product_id = getParameterByName("id", window.location.href);
        if (!this.product_id){
            this.props.history.push("/not-found");
        }
        this.makeGetProductApiCall(this.product_id);
    }

    handleLoginWarning = () => {
        this.setState({ loginModalActive: true });
    };

    handleCloseModal = () => {
        this.setState({ loginModalActive: false });
    };

    async makeGetProductApiCall() {
        this.setState({ productLoaderActive: true });
        try {
            let response = await commonApi.get(`products/${this.product_id}`, {
                params: {},
            });
            console.log("product response", response);
            if (response.data && response.data.success) {
                let productInfoList = [];
                Object.keys(response.data.data[0].description).forEach(
                    (key, idx) => {
                        productInfoList.push({
                            key: key,
                            value: response.data.data[0].description[key],
                            count: idx,
                        });
                    }
                );
                this.setImageItems(response.data.data[0]);
                this.setState({
                    productInfoList: productInfoList,
                    productInfoCount: productInfoList.length,
                    productData: response.data.data[0],
                    productLoaderActive: false,
                    mode: "view"
                });
            } else {
                this.setImageItems(null);
                this.setState({ productData: {}, productLoaderActive: false });
            }
        } catch (e) {
            console.log("error", e);
            this.setImageItems(null);
            this.setState({ productData: {}, productLoaderActive: false });
        }
    }

    async handleCartToggle(e) {
        e.stopPropagation();

        if (!this.props.auth.isAuthenticated) {
            this.handleLoginWarning();
            return;
        }
        if (!this.state.activeSize) {
            this.setState({ sizeSelectWarning: true });
            return;
        }
        this.setState({
            isAddingToCartLoading: true,
            sizeSelectWarning: false,
        });
        let session = await getSession();
        let product_id = this.state.productData.variants[this.state.activeSize]._id;
        try {
            let response = await commonApi.post(
                `update_cart`,
                { product_id: product_id, count: 1 },
                { headers: { Authorization: session.accessToken.jwtToken } }
            );
            console.log("cart product response", response);
            if (response.data && response.data.success) {
                this.setState({ isAddingToCartLoading: false });
                fetchCartItems();
            } else {
                this.setState({ isAddingToCartLoading: false });
            }
        } catch (e) {
            console.log("error", e);
            this.setState({ isAddingToCartLoading: false });
        }
    }

    async handleVerifyPincode(e) {
        e.stopPropagation();

        if (!this.props.auth.isAuthenticated) {
            this.handleLoginWarning();
            return;
        }
        if (!this.state.pincode || isNaN(this.state.pincode) || this.state.pincode.length !== 6 ) {
            this.setState({
                pincodeValidationMsg: "Enter a valid Pincode",
                pincodeValidationStatus: "error",
            });
            return;
        }
        this.setState({ pincodeCheckLoading: true, sizeSelectWarning: false });
        let session = await getSession();
        let product_id = this.props.productData.variants[this.state.activeSize]._id;
        try {
            let response = await commonApi.post(
                `update_cart`,
                { product_id: product_id, count: 1 },
                { headers: { Authorization: session.accessToken.jwtToken } }
            );
            console.log("wishlist response", response);
            if (response.data && response.data.success) {
                this.setState({
                    pincodeValidationMsg: response.data.message,
                    pincodeValidationStatus: "success",
                    pincodeCheckLoading: false,
                });
            } else {
                this.setState({
                    pincodeValidationMsg: response.data.message,
                    pincodeValidationStatus: "error",
                    pincodeCheckLoading: false,
                });
            }
        } catch (e) {
            console.log("error", e);
            this.setState({
                pincodeValidationMsg: "Please try again",
                pincodeValidationStatus: "error",
                pincodeCheckLoading: false,
            });
        }
    }

    handleSubmit = async () => {
        let images = this.state.imageItems.map((obj)=>( obj.src ));

        if (!this.state.payload.size && !this.state.activeSize && images === this.state.productData.images) {
            this.setState({
                responseText: "Please select a size or enter manually in input",
                responseType: "error",
            });
            return;
        } 
        let size = this.state.payload.size
            ? this.state.payload.size
            : this.state.activeSize;
        // if (!this.state.payload.stock && (!Object.keys(this.state.payload).length) &&
        //     this.state.productData.available_sizes.includes(size)
        // ){
        //     this.setState({
        //         responseText: "Update a field before submitting",
        //         responseType: "error"
        //     })
        //     return;
        // }
        this.setState({ isSubmitLoading: true });
        // creating payload
        let payload = {
            ...this.state.productData,
            product_code: this.state.productData._id,
            ...this.state.payload,
        };
        if (!!size){
            payload.size = Number(size);
        }
        // updating stock info 
        if (this.state.payload.stock) {
            payload = { ...payload, stock: Number(this.state.payload.stock) };
        } else {
            payload = { ...payload, stock: 0 };
        }
        // no need for updating these values so deleting it
        delete payload.total_stock;
        delete payload._id;

        // updating description
        let description = {};
        this.state.productInfoList.forEach((obj, idx) => {
            description[obj.key] = obj.value;
        });
        payload.description = description;

        // updating images
        
        payload.images = images;
        let session = await getSession();
        if (!session) {
            return;
        }
        let response;
        try {
            response = await commonApi.post("update_product_stock", payload, {
                headers: { Authorization: session.accessToken.jwtToken },
            });
            console.log("response", response);
            if (response && response.status === 200 && response.data.success) {
                this.setState({
                    productResults: response.data.data.products,
                    responseType: "success",
                    responseText: "Updated product successfully",
                });
            } else {
                this.setState({
                    productResults: [],
                    responseType: "error",
                    responseText: response.data.message,
                });
            }
        } catch (err) {}
        this.setState({
            isSubmitLoading: false,
        });
    };

    getPriceJSX = () => {
        let discount = this.state.productData.discount;
        let price = discount ? 
            this.state.productData.price - Math.round((this.state.productData.price * discount) / 100) : 
            this.state.productData.price;

        return (
            <Fragment>
                <p className="price-text">Rs. {roundOffNumber(price)}</p>
                {!!discount && (
                    <Fragment>
                        <p className="actual-price-text">
                            Rs. {roundOffNumber(this.state.productData.price)}
                        </p>
                        <p className="discount-text">({discount}% OFF)</p>
                    </Fragment>
                )}
            </Fragment>
        );
    };

    handleSizeSelect = (size) => {
        if (this.state.activeSize === size) {
            this.setState({ activeSize: "" });
        } else {
            this.setState({ activeSize: size });
        }
    };

    getSizesJSX = () => {
        let allSizes = this.state.productData.available_sizes;
        allSizes = allSizes.sort();
        return (
            <Fragment>
                {allSizes.map((size, idx) => {
                    let sizeWarning =
                        !!this.state.productData.variants[size].stock &&
                        this.state.productData.variants[size].stock <= 10;
                    return (
                        <div
                            className={
                                sizeWarning
                                    ? "size-box-content size-with-warning"
                                    : "size-box-content"
                            }
                        >
                            <button
                                className={
                                    this.state.activeSize === size
                                        ? "size-box active"
                                        : this.state.mode !== "edit" &&
                                          this.state.productData.variants[size]
                                              .stock === 0
                                        ? "size-box disabled"
                                        : "size-box"
                                }
                                disabled={
                                    this.state.mode !== "edit" &&
                                    this.state.productData.variants[size]
                                        .stock === 0
                                }
                                onClick={() => {
                                    this.handleSizeSelect(size);
                                }}
                            >
                                {size}
                            </button>
                            {sizeWarning && (
                                <div className="size-availablity-label warning">
                                    {this.state.productData.variants[size]
                                        .stock + " Left"}
                                </div>
                            )}
                        </div>
                    );
                })}
            </Fragment>
        );
    };

    getInputJSX = (name, type) => {
        return (
            <div
                className={
                    this.state.errors[name] ? "control is-danger" : "control"
                }
            >
                <input
                    placeholder={"Enter " + titleCase(name)}
                    className={
                        this.state.errors[name]
                            ? "input editable-input is-danger"
                            : "input editable-input"
                    }
                    type={type}
                    name={name}
                    value={
                        this.state.payload.hasOwnProperty(name)
                            ? this.state.payload[name]
                            : this.state.productData[name]
                    }
                    onChange={this.onPayloadChange}
                />
            </div>
        );
    };

    onPayloadChange = (event) => {
        let payload = { ...this.state.payload };
        payload[event.target.name] = event.target.value;
        this.setState({
            payload,
        });
    };

    onInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        });
    };

    handleAddProductInfo = () => {
        let { productInfoList, productInfoCount } = this.state;
        productInfoCount = productInfoCount + 1;
        productInfoList.push({
            count: productInfoCount,
            key: "",
            value: "",
        });
        this.setState({
            productInfoList,
            productInfoCount,
        });
    };

    handleRemoveProductInfo = (infoObj) => {
        let { productInfoList } = this.state;
        let objIdx = findindex(productInfoList, { count: infoObj.count });
        productInfoList.splice(objIdx, 1);
        this.setState({
            productInfoList,
        });
    };

    onProductInfoChange = (e, infoObj) => {
        let { productInfoList } = this.state;
        let objIdx = findindex(productInfoList, { count: infoObj.count });
        productInfoList[objIdx][e.target.name] = e.target.value;
        this.setState({
            productInfoList,
        });
    };

    getProductInfoInputs = (infoObj, idx) => {
        return (
            <div className="product-info-field">
                <div
                    className={
                        this.state.errors[name]
                            ? "key-input-control control is-danger"
                            : "key-input-control control"
                    }
                >
                    <input
                        defaultValue={infoObj.key}
                        className="input editable-input"
                        placeholder="Enter Title"
                        type="text"
                        name="key"
                        onChange={(e) => {
                            this.onProductInfoChange(e, infoObj);
                        }}
                    />
                </div>
                <div
                    className={
                        this.state.errors[name]
                            ? "value-input-control control is-danger"
                            : "value-input-control control"
                    }
                >
                    <input
                        defaultValue={infoObj.value}
                        className="input editable-input"
                        placeholder="Enter Info Value"
                        type="text"
                        name="value"
                        onChange={(e) => {
                            this.onProductInfoChange(e, infoObj);
                        }}
                    />
                </div>
                <button
                    className="delete is-medium is-danger is-light"
                    onClick={() => {
                        this.handleRemoveProductInfo(infoObj);
                    }}
                ></button>
            </div>
        );
    };

    changeActiveImage = (input) => {
        let newIndex = this.state.activeImageindex + input;
        if (newIndex === -1) {
            newIndex = this.state.productData.images.length - 1;
        } else if (newIndex === this.state.productData.images.length) {
            newIndex = 0;
        }
        this.setState({ activeImageindex: newIndex });
    };

    setActiveImage = (input) => {
        this.setState({ activeImageindex: input });
    };

    changeMode = (mode) => {
        this.setState({
            mode,
        });
    };

    // a little function to help us with reordering the result
    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    setImageItems = (data) => {
        if (!data) {
            return;
        }

        // data.images.push(data.images[0])
        // data.images.push(data.images[1])
        // data.images.push(data.images[2])
        // data.images.push(data.images[3])
        this.setState({
            imageItems: data.images.map((imgSrc, idx) => ({
                id: uuidv4(),
                src: imgSrc,
            })),
        });
    };

    getItemStyle = (isDragging, draggableStyle) => {
        // if (this.state.imageItems.length < 3){
        //     return `draggable-img-${this.state.imageItems.length}`;
        // } else {
        //     return `draggable-img-3`;
        // }
        // some basic styles to make the items look a bit nicer
        return {
            position: "relative",
            fontFamily: "inherit",
            userSelect: "none",
            padding: `${this.state.imageItems.length/2}px`,
            // margin: `0 ${this.state.imageItems.length}px 0 0`,

            // change background colour if dragging
            background: isDragging ? "lightgreen" : "#ffffff00",
            width: this.state.imageItems.length && this.state.imageItems.length < 3 ? `${100/this.state.imageItems.length}%`: "33.33%",
            // styles we need to apply on draggables
            ...draggableStyle,
        }
    };

    getListStyle = (isDraggingOver) => ({
        fontFamily: "inherit",
        background: isDraggingOver ? "lightblue" : "lightgrey",
        display: "flex",
        padding: this.state.imageItems.length,
        overflow: "auto",
        flexWrap: "wrap"
    });

    onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const imageItems = this.reorder(
            this.state.imageItems,
            result.source.index,
            result.destination.index
        );

        this.setState({ imageItems });
    };

    handleRemoveImage = (id) => {
        let {imageItems} = this.state;
        let objIdx = findindex(this.state.imageItems, { id: id });
        imageItems.splice(objIdx, 1);
        this.setState({imageItems})
    }

    render() {
        let adminuser =
            this.props.auth.user &&
            this.props.auth.user.signInUserSession.accessToken.hasOwnProperty(
                "payload"
            ) &&
            this.props.auth.user.signInUserSession.accessToken.payload.hasOwnProperty(
                "cognito:groups"
            ) &&
            this.props.auth.user.signInUserSession.accessToken.payload[
                "cognito:groups"
            ].length &&
            this.props.auth.user.signInUserSession.accessToken.payload[
                "cognito:groups"
            ].includes("labroz_admin");
        return (
            <div className="product-container">
                <div
                    className={
                        this.state.loginModalActive
                            ? "modal is-active"
                            : "modal"
                    }
                >
                    <div className="modal-background"></div>
                    <div className="modal-content">
                        <div className="login-modal-content">
                            <div className="login-modal-header">
                                <div className="login-modal-title">
                                    You need to be logged in to Add products to
                                    Cart
                                    {/* /Wishlist */}
                                </div>
                                <button
                                    onClick={this.handleCloseModal}
                                    className="delete"
                                    aria-label="close"
                                ></button>
                            </div>
                            <div className="login-modal-body">
                                <div className="buttons-container">
                                    <button className="button is-link">
                                        <Link to="/login">Login</Link>
                                    </button>
                                    <div className="or-text">OR</div>
                                    <button className="button is-link">
                                        <Link to="/signup">Signup</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.productLoaderActive ? (
                    <div className="loader-container">
                        <Spinner color="primary" size="medium" />
                    </div>
                ) : Object.keys(this.state.productData).length ? (
                    <Fragment>
                        <div className="left-container">
                            <nav
                                className="breadcrumb"
                                aria-label="breadcrumbs"
                            >
                                <ul>
                                    <li>
                                        <Link to="/home">Home</Link>
                                    </li>
                                    <li>
                                        <Link to="/products">Products</Link>
                                    </li>
                                    <li className="is-active">
                                        <Link
                                            to={
                                                window.location.href.split(
                                                    window.location.origin
                                                )[1]
                                            }
                                            aria-current="page"
                                        >
                                            {titleCase(
                                                this.state.productData
                                                    .sub_category
                                            )}
                                        </Link>
                                    </li>
                                </ul>
                            </nav>
                            <div className={`images-container`}>
                                {this.state.mode == "view" ? (
                                    <Fragment>
                                        {this.state.productData.images &&
                                            this.state.productData.images.length > 1 && (
                                                <button
                                                    className="arrow-btn"
                                                    onClick={() => {
                                                        this.changeActiveImage(
                                                            -1
                                                        );
                                                    }}
                                                >
                                                    &#10094;
                                                </button>
                                            )}
                                        <div
                                            className="w3-content w3-display-container"
                                            style={{ maxWidth: "100%" }}
                                        >
                                            {this.state.productData.images.map(
                                                (imgSrc, Idx) => {
                                                    return (
                                                        <img 
                                                            className={this.state.activeImageindex === Idx ? "mySlides active" : "mySlides"}
                                                            src={imgSrc}
                                                        />
                                                    );
                                                }
                                            )}
                                            {this.state.productData.images.length > 1 && (
                                                <Fragment>
                                                    <div
                                                        className="w3-center w3-container w3-section w3-large w3-text-white w3-display-bottommiddle"
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    >
                                                        {this.state.productData.images.map(
                                                            (imgSrc, idxx) => {
                                                                return (
                                                                    <span
                                                                        className={
                                                                            this
                                                                                .state
                                                                                .activeImageindex ===
                                                                            idxx
                                                                                ? "w3-badge demo w3-transparent w3-hover-white w3-white"
                                                                                : "w3-badge demo w3-transparent w3-hover-white"
                                                                        }
                                                                        onClick={() => {
                                                                            this.setActiveImage(
                                                                                idxx
                                                                            );
                                                                        }}
                                                                    ></span>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </Fragment>
                                            )}
                                        </div>
                                        {this.state.productData.images &&
                                            this.state.productData.images
                                                .length > 1 && (
                                                <button
                                                    className="arrow-btn"
                                                    onClick={() => {
                                                        this.changeActiveImage(
                                                            1
                                                        );
                                                    }}
                                                >
                                                    &#10095;
                                                </button>
                                            )}
                                    </Fragment>
                                ) : (
                                    // in edit mode
                                    <Fragment>
                                        <DragDropContext
                                            onDragEnd={this.onDragEnd}
                                        >
                                            <Droppable
                                                droppableId="droppable"
                                                direction="horizontal"
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        style={this.getListStyle(
                                                            snapshot.isDraggingOver
                                                        )}
                                                        {...provided.droppableProps}
                                                    >
                                                        {this.state.imageItems.map(
                                                            (item, index) => (
                                                                <Draggable
                                                                    key={item.id}
                                                                    draggableId={item.id}
                                                                    index={index}
                                                                >
                                                                    {( provided, snapshot ) => (
                                                                        <div ref={provided.innerRef}
                                                                            {...provided.draggableProps}
                                                                            {...provided.dragHandleProps}
                                                                            style={this.getItemStyle(
                                                                                snapshot.isDragging,
                                                                                provided.draggableProps.style
                                                                            )}
                                                                        >
                                                                            <div className="position-element">{index+1}</div>
                                                                            <button 
                                                                                className="remove-img-btn delete is-medium is-danger is-light"
                                                                                onClick={()=>{this.handleRemoveImage(item.id)}}
                                                                            ></button>
                                                                            <img style={{ maxHeight: "80vh" }} src={item.src}/>
                                                                        </div>
                                                                    )}
                                                                </Draggable>
                                                            )
                                                        )}
                                                        {provided.placeholder}
                                                    </div>
                                                )}
                                            </Droppable>
                                        </DragDropContext>
                                    </Fragment>
                                )}
                            </div>
                        </div>
                        <div className="right-container">
                            {adminuser && this.state.mode === "view" && (
                                <button
                                    className="button is-dark edit-btn"
                                    onClick={() => {
                                        this.changeMode("edit");
                                    }}
                                >
                                    <span className="icon">
                                        <FontAwesomeIcon icon="pencil-alt" />
                                    </span>
                                    Edit
                                </button>
                            )}
                            {adminuser && this.state.mode === "edit" && (
                                <div className="field-container">
                                    <div className="field-title">
                                        Add item stocks
                                    </div>
                                    {this.getInputJSX("stock", "number")}
                                </div>
                            )}
                            {adminuser && this.state.mode === "edit" ? (
                                <div className="field-container">
                                    <div className="field-title">Title</div>
                                    {this.getInputJSX("title", "text")}
                                </div>
                            ) : (
                                <div className="product-title">
                                    {this.state.productData.title
                                        ? this.state.productData.title
                                        : `Mens blue ${titleCase(
                                              this.state.productData.category
                                          )}`}
                                </div>
                            )}
                            {adminuser && this.state.mode === "edit" ? (
                                <div className="field-container">
                                    <div className="field-title">
                                        Price and Discount
                                    </div>
                                    <div className="two-inputs">
                                        {this.getInputJSX("price", "number")}
                                        {this.getInputJSX("discount", "number")}
                                    </div>
                                </div>
                            ) : (
                                <div className="price-container">
                                    {this.getPriceJSX()}
                                </div>
                            )}
                            <div className="field-container">
                                <div className="field-title">Size</div>
                                <div className="sizes-content">
                                    {this.getSizesJSX()}
                                    {adminuser &&
                                        this.state.mode === "edit" &&
                                        this.getInputJSX("size", "text")}
                                </div>
                            </div>
                            {this.state.mode !== "edit" && (
                                <Fragment>
                                    <button
                                        className={
                                            this.state.isAddingToCartLoading
                                                ? "button is-fullwidth is-loading add-to-cart-btn"
                                                : "button is-fullwidth add-to-cart-btn"
                                        }
                                        onClick={this.handleCartToggle.bind(
                                            this
                                        )}
                                    >
                                        <span className="icon">
                                            <FontAwesomeIcon icon="cart-plus" />
                                        </span>
                                        Add to Cart
                                    </button>
                                    <div className="field-container">
                                        <div className="field-title">
                                            Delivery Availibility
                                        </div>
                                        <div className="field-content">
                                            <div className="check-pincode-input-container">
                                                <div
                                                    className={
                                                        this.state.pincodeValidationStatus === "error"
                                                            ? "control is-danger"
                                                            : this.state.pincodeValidationStatus === "success"
                                                            ? "control is-success"
                                                            : "control"
                                                    }
                                                >
                                                    <input
                                                        placeholder="Enter your Pincode"
                                                        className={
                                                            this.state.pincodeValidationStatus ===
                                                            "error"
                                                                ? "input is-danger"
                                                                : this.state.pincodeValidationStatus ===
                                                                  "success"
                                                                ? "input is-success"
                                                                : "input"
                                                        }
                                                        type="text"
                                                        name="pincode"
                                                        maxLength="6"
                                                        onChange={
                                                            this.onInputChange
                                                        }
                                                    />
                                                </div>
                                                <button
                                                    className="button is-fullwidth check-btn"
                                                    onClick={this.handleVerifyPincode.bind(this)}
                                                >
                                                    Check
                                                </button>
                                            </div>
                                            {this.state.pincodeValidationMsg && (
                                                <p
                                                    className={
                                                        this.state.pincodeValidationStatus ===
                                                        "error"
                                                            ? "help is-danger"
                                                            : this.state
                                                                  .pincodeValidationStatus ===
                                                              "success"
                                                            ? "help is-success"
                                                            : "help is-info"
                                                    }
                                                >
                                                    {
                                                        this.state.pincodeValidationMsg
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Fragment>
                            )}
                            {(this.state.productData.color ||
                                (adminuser && this.state.mode === "edit")) && (
                                <div className="field-container">
                                    <div className="field-title">
                                        {adminuser && this.state.mode === "edit"
                                            ? "Color and hex Code"
                                            : "Color"}
                                    </div>
                                    {adminuser && this.state.mode === "edit" ? (
                                        <div className="two-inputs">
                                            {this.getInputJSX("color", "text")}
                                            {this.getInputJSX(
                                                "color_code",
                                                "text"
                                            )}
                                        </div>
                                    ) : (
                                        <div className="colors-content">
                                            <Fragment>
                                                <div
                                                    className="color-box"
                                                    style={{
                                                        backgroundColor: this
                                                            .state.productData
                                                            .color,
                                                    }}
                                                ></div>
                                                {titleCase(
                                                    this.state.productData.color
                                                )}
                                            </Fragment>
                                        </div>
                                    )}
                                </div>
                            )}
                            {(this.state.productData.fit ||
                                (adminuser && this.state.mode === "edit")) && (
                                <div className="field-container">
                                    <div className="field-title">Fit</div>
                                    <div className="field-content">
                                        {adminuser && this.state.mode === "edit"
                                            ? this.getInputJSX("fit", "text")
                                            : titleCase(
                                                  this.state.productData.fit
                                              )}
                                    </div>
                                </div>
                            )}
                            {(this.state.productData.fabric ||
                                (adminuser && this.state.mode === "edit")) && (
                                <div className="field-container">
                                    <div className="field-title">
                                        Material & Fabric
                                    </div>
                                    <div className="field-content">
                                        {adminuser && this.state.mode === "edit"
                                            ? this.getInputJSX("fabric", "text")
                                            : // <div className="color-box"style={{ backgroundColor: this.state.productData.color }}></div>
                                              titleCase(
                                                  this.state.productData.fabric
                                              )}
                                    </div>
                                </div>
                            )}
                            {adminuser && this.state.mode === "edit" ? (
                                <div className="product-info-container">
                                    <button
                                        className="button is-light is-success is-fullwidth add-desc-btn"
                                        onClick={this.handleAddProductInfo}
                                    >
                                        Add Additional Product Info
                                        <FontAwesomeIcon
                                            icon="plus-square"
                                            className="add-icon ico"
                                        />
                                    </button>
                                    {this.state.productInfoList.map(
                                        (infoObj, index) => {
                                            return this.getProductInfoInputs(
                                                infoObj,
                                                index
                                            );
                                        }
                                    )}
                                </div>
                            ) : (
                                !!Object.keys(
                                    this.state.productData.description
                                ).length &&
                                Object.keys(
                                    this.state.productData.description
                                ).map((key, idx) => {
                                    return (
                                        <div className="field-container">
                                            <div className="field-title">
                                                {key}
                                            </div>
                                            <div className="field-content">
                                                {
                                                    this.state.productData
                                                        .description[key]
                                                }
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {this.state.sizeSelectWarning && (
                                <div className="select-size-error">
                                    Select Size
                                </div>
                            )}
                            {this.state.mode === "edit" && adminuser && (
                                <Fragment>
                                    {this.state.responseText && (
                                        <div
                                            className={`response-text is-${this.state.responseType}`}
                                        >
                                            <span className="response-tag">
                                                {this.state.responseText}
                                            </span>
                                        </div>
                                    )}
                                    <div className="action-buttons">
                                        <button
                                            className={
                                                this.state.isSubmitLoading
                                                    ? "button is-fullwidth is-loading update-btn"
                                                    : "button is-fullwidth update-btn"
                                            }
                                            onClick={this.handleSubmit.bind(
                                                this
                                            )}
                                        >
                                            Submit and Update
                                        </button>
                                        <button
                                            className="button is-fullwidth cancel-btn"
                                            onClick={() => {
                                                this.changeMode("view");
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Fragment>
                            )}
                        </div>
                    </Fragment>
                ) : (
                    <div className="no-data">
                        No Data Available for this Product
                    </div>
                )}
            </div>
        );
    }
}

export default Product;
