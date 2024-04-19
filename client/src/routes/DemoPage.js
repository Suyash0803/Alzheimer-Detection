import Hero from "../components/Hero";
import NavBar from "../components/NavBar"
import aboutImg from "../assets/night.jpg"
import Footer from "../components/Footer";
import Demo from "../components/Demo";

function DemoPage (){
    return(
        <>
       <NavBar/>
        <Hero
        cName="hero-mid"
        heroImg={aboutImg}
        title="Demo"
        />
        <Demo/>
        <Footer/>
        </>
    )
}

export default DemoPage;