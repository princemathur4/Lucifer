import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import { observer } from 'mobx-react';
import "./style.scss";
import { getParameterByName } from '../../utils/Browser';
import commonApi from "../../apis/common";
import { getSession } from "../../utils/AuthUtils";
import Spinner from "../../components/Spinner";
import { toJS } from 'mobx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ComingSoonPage extends React.Component {
    constructor(props) {
        super(props);
        this._id = '';
    }

    render(){
        return(
            <div className="coming-soon-container">
                {/* <img src="https://i.ibb.co/SxsBw86/soon-006-1490026999894.png"/> */}
                <img src="https://i.ibb.co/0GznXVY/coming-soon-page-1151093.png"/>
            </div>
        )
    }
}

export default ComingSoonPage;