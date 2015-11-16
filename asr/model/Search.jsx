var React = require('react');
var request = require('superagent');

var Search = React.createClass({
  getInitialState(){
    return {results: []};
  },
  componentWillUnmount: function () {
    if (this.req) {
      this.req.abort();
      this.req = null;
    }

    document.documentElement.style.overflow = 'auto';
  },
  _handleInput(e){
    var input = e.target.value;

    if (this.req) {
      this.req.abort();
      this.req = null;
    }

    if (!input.trim().length) {
      return this.setState({results: []});
    }

    var self = this;
    this.req = request.get('http://104.130.23.111:81/api/search/' + encodeURIComponent(input))
      .end(function (err, res) {
        if (err || res.status !== 200) return self.req = null;
        try {
          self.setState({results: res.body.results});
        } catch (e) {
          // ignore
        }
      });
  },
  componentDidMount: function () {
    this.refs.root.classList.remove('opacity-0');
    document.documentElement.style.overflow = 'hidden';
  },
  getResultsFor(a){

    var children;

    children = this.state.results.map(function (res, i) {
      if (res.entity !== prop) return;
      return (
        <div key={i}>
          <div className='flex' style={{padding: 20,borderBottom: '1px solid #333'}}>
            <div className='box' style={{ borderRadius: 3, display: 'inline-block', marginRight: 10, position: 'relative',
                    top: -2, verticalAlign: 'middle',backgroundImage:"url('" + res.images[0].source + "')",
                    backgroundSize:'cover', height:40, width: 30, maxWidth: 30, minWidth: 30, marginRight:10,
                    backgroundPosition:'center center'}}/>
            <div className='box full'>
              {res.name}
              <div
                style={{letterSpacing:0,fontSize:12,textTransform:'none',opacity:0.5}}>{res.deck}</div>
            </div>
          </div>
        </div>
      )
    });

    return <div style={{borderRight:'1px solid #444', position:'relative'}} className="box">
      { children.length ? <div>{children}</div> : <div className="empty">No {a} found</div>}
    </div>
  },
  render(){
    var children;

    children = this.state.results.map(function (res, i) {
      return (
        <div key={i}>
          <div className='flex' style={{padding: 20,borderBottom: '1px solid #333'}}>
            <div className='box' style={{ borderRadius: 3, display: 'inline-block', marginRight: 10, position: 'relative',
                    top: -2, verticalAlign: 'middle',backgroundImage:"url('" + res.images[0].source + "')",
                    backgroundSize:'cover', height:40, width: 30, maxWidth: 30, minWidth: 30, marginRight:10,
                    backgroundPosition:'center center'}}/>
            <div className='box full'>
              {res.name}
              <div
                style={{letterSpacing:0,fontSize:12,textTransform:'none',opacity:0.5}}>{res.deck}</div>
            </div>
          </div>
        </div>
      )
    });

    return (
      <div ref='root' className="full flex vertical animate-1 opacity-0"
           style={{background:'#222',position:'fixed',zIndex:4,left:0,top:0,right:0,bottom:0}}>
        <div style={{background:'#444',width:'100%',position:'relative'}}><input
          onChange={this._handleInput}
          placeholder="Search entity"
          style={{lineHeight:'40px',background:'transparent',border:'none',margin:0,fontSize:20,padding:20,paddingRight:50,color:'#fff',
          width:'100%'}}/>
          <div style={{position:'absolute',right:0,top:0,bottom:0,width:50}}>
            <div className='full icon close search-close'
                 onClick={this.props.onClose}>
            </div>
          </div>
        </div>
        <div className="full flex" style={{height:'100%',overflow:'scroll'}}>
          {this.getResultsFor('game')}
          {this.getResultsFor('company')}
          {this.getResultsFor('platform')}
        </div>
      </div>
    )
  }
});


module.exports = Search;