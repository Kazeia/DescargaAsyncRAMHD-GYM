import React from 'react'
import downloadDriveGYM from './downloadDriveGYM.js'
import {
  BrowserRouter,
  Route,
  Link
} from 'react-router-dom'

const Home = () => (
  <div>
    <h2>Hola a webapp react</h2>
  </div>
)

const About = () => (
  <div>
    <h2>Hola david!!!</h2>
  </div>
)

const Services = () => (
  <ul>
    <li>ser1</li>
    <li>ser2</li>
  </ul>
)

const Contact = () => (
  <div>
    <h2>contact</h2>
  </div>
)


class App extends React.Component {

  constructor(...props) {
    super(...props)

    this.state = {
      redirectRoute: false
    }

    this.download = this.download.bind(this)
  }
  download() {
    downloadDriveGYM.download();
  }

  render() {
    return (

      <BrowserRouter>
        <div>
          <input type="text" name="IDLink" placeholder="Public ID-Link of GoogleDrive" id="IDLink" style={{ width: "850px" }} />

          {/* Start Download */}
          <button name="download" id="download" onClick={this.download}>Download Now!</button>

          <br />
          <svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
            <g>
              <title>SVG for download</title>
              <rect id="canvas_background" opacity="0" fill="#fff" x="0" y="0" opa width="600" height="600" />
              <g id="canvasGrid" display="none">
                <rect id="svg_9" width="100%" height="100%" x="0" y="0" stroke-width="0" fill="url(#gridpattern)" />
              </g>
            </g>
            <g>
              <title>by: GMI</title>
              <rect id="svg_0" opacity="0" fill="#fdb913" stroke="#000" stroke-width="0" x="0" y="0" width="200" height="200" />
              <rect id="svg_1" opacity="0" fill="#fbaa19" stroke="#000" stroke-width="0" x="200" y="0" width="200" height="200" />
              <rect id="svg_2" opacity="0" fill="#f8971d" stroke="#000" stroke-width="0" x="400" width="200" height="200" />
              <rect id="svg_3" opacity="0" fill="#f6861f" stroke="#000" stroke-width="0" x="400" width="200" height="200" y="200" />
              <rect id="svg_4" opacity="0" fill="#f36f21" stroke="#000" stroke-width="0" x="400" width="200" height="200" y="400" />
              <rect id="svg_5" opacity="0" fill="#f6861f" stroke="#000" stroke-width="0" x="200" width="200" height="200" y="400" />
              <rect id="svg_6" opacity="0" fill="#f8971d" stroke="#000" stroke-width="0" x="0" width="200" height="200" y="400" />
              <rect id="svg_7" opacity="0" fill="#fbaa19" stroke="#000" stroke-width="0" x="0" width="200" height="200" y="200" />

              <text id="svg_8" opacity="0" fill="#f6861f" stroke="#000" stroke-width="0" x="201" y="317.5" font-size="50" font-family="Euphoria, sans-serif"
                text-anchor="start" xmlSpace="preserve" font-style="italic" font-weight="normal">0%</text>
            </g>
          </svg>
          <h1>Primeros pasos con React Router</h1>

          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </nav>
          <hr />
          <Route exact path="/" component={Home} />
          <Route exact path="/about" component={About} />
          <Route exact path="/services" component={Services} />
          <Route exact path="/contact" component={Contact} />
        </div>
      </BrowserRouter>
    )
  }
};
export default App