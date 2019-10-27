import React,{Fragment} from 'react';
import NavBar from '../../components/NavBar';
import Content from '../../components/Content';
import Footer from '../../components/Footer';

class Home extends React.Component{
    render(){
        return (
            <Fragment>
                <NavBar/>
                <Content/>
                <Footer/>
            </Fragment>
        )
    }
}
export default Home;