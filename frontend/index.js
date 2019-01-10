let api = {
    v1: {
        run: function () {
            return '/api/v1/run/'
        },
        code: {
            list: function () {
                return '/api/v1/code/'
            },
            create: function (run = false) {
                let base = '/api/v1/code/';
                return run ? base + '?run' : base
            },
            detail: function (id, run = false) {
                let base = `/api/v1/code/${id}/`;
                return run ? base + '?run' : base
            },
            remove: function (id) {
                return api.v1.code.detail(id, false)
            },
            update: function (id, run = false) {
                return api.v1.code.detail(id, run)
            }
        }
    }
}





class List extends React.Component{
    

    render(){
        console.log(this.props.info.list);
        let DOM = this.props.info.list.map((item,index) => (
            <tr key={index}> 
                <td  className="text-center">{ item.name}</td>
                <td>
                    <button  className='btn btn-primary' onClick={()=>this.props.getDetail(item.id)}>View</button>
                    <button  className="btn btn-primary" onClick={()=>this.props.run(item.id)}>Run</button>
                    <button  className="btn btn-danger" onClick={()=>this.props.remove(item.id)}>Delete</button>
                </td>
            </tr>
            ))
        return(
            <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="text-center">Name</th>
                            <th className="text-center">Options</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DOM}
                    </tbody>
            </table>
        );
    }
}
class Options extends React.Component{
//  constructor(props){
//         super(props);
//         this.newOptions = this.newOptions.bind(this);

//     }


        // run() {
        //     console.log(this.props.store)

        //     this.props.store.actions.run(store.state.code)
        // }

        

    render(){
        return(
            <div style={{display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap'}} >
                <button className="btn btn-primary" onClick={()=>this.props.run()}>Run</button>
                <button className="btn btn-primary" onClick={()=>this.props.save()}>Save</button>
                <button className="btn" onClick={()=>this.props.update()}>Run&Save</button>
                <button className="btn btn-primary" onClick={()=>this.props.newOptions()}>New</button>
            </div>
        )}

}
class Input extends React.Component{
    // constructor(props){
    //     super(props);

    //     this.inputHandler = this.inputHandler.bind(this);
    //     this.inputNameHandler = this.inputNameHandler.bind(this);

    // }
    render(){
        return(
            <div className="form-group">
                <textarea
                    className="form-control"
                    id="input"
                    value={this.props.info.code}
                    onChange={(e)=>this.props.inputHandler(e)} 
                    />
                <label>Name</label>
                <p className="text-info">If need to save, please give a name:</p>
                <input
                    type="text"
                    className="form-control"
                    value={this.props.info.name}
                    onChange={(e)=>this.props.inputNameHandler(e)}
                    />
            </div>
        )}

}

class Output extends React.Component{
    
    // componentDidUpdate(prevProps) {
       
    //         let ele = $(this.$el);
    //         ele.css({
    //             'height': 'auto',
    //             'overflow-y': 'hidden'
    //         }).height(ele.prop('scrollHeight'))
          
        
    // }


    render(){

        return(
            <textarea style={{ height: 150 }} disabled
            className="form-control text-center" value={this.props.info.output} />

        )}
}
class App extends React.Component{
    constructor(props){
        super(props);
        // this.store = this.store.bind(this);
        this.state = {info:this.info};
        this.freshList(); // Store的初始化工作，先获取代码列表
    }
    
    info = {
        list: [],
        code: '',
        name: '',
        id: '',
        output: ''
    }
    
    run (code) { //运行代码
        let self = this;
        $.post({
            url: api.v1.run(),
            data: {code: code},
            dataType: 'json',
            // async: false,
            success: function (data) {
                
                self.info.output = data.output
                // self.App.setState({})
                self.setState({info:self.info})
            }
        })
    }
    runDetail (id) { //运行特定的代码
        let self = this;
        $.getJSON({
            url: api.v1.run() + `?id=${id}`,
            success: function (data) {
                self.info.output = data.output
                self.setState({info:self.info})
            }
        })
    }
    freshList() { //获得代码列表
        let self = this;
        $.getJSON({
            url: api.v1.code.list(),
            success: function (data) {
                self.info.list = data
                self.setState({info:self.info})
            }
        })
    }
    getDetail(id) {//获得特定的代码实例
        let self = this;
        $.getJSON({
            url: api.v1.code.detail(id),
            success: function (data) {
                self.info.id = data.id;
                self.info.name = data.name;
                self.info.code = data.code;
                self.info.output = '';
                self.setState({info:self.info})
            }
        })
    }
    create(run = false) { //创建新代码
        let self = this;
        $.post({
            url: api.v1.code.create(run),
            data: {
                name: self.info.name,
                code: self.info.code
            },
            dataType: 'json',
            success: function (data) {
                if (run) {
                    self.info.output = data.output
                }
                self.freshList()
                self.setState({info:self.info})
            }
        })
    }
    update(id, run = true) { //更新代码
        let self = this;
        $.ajax({
            url: api.v1.code.update(id, run),
            type: 'PUT',
            data: {
                name: self.info.name,
                code: self.info.code
            },
            dataType: 'json',
            success: function (data) {
                if (run) {
                    self.info.output = data.output
                }
                self.freshList()
                self.setState({info:self.info})
            }
        })
    }
    remove(id) { //删除代码
        let self = this;
        $.ajax({
            url: api.v1.code.remove(id),
            type: 'DELETE',
            dataType: 'json',
            success: function (data) {
                self.freshList()
                self.setState({info:self.info})
            }
        })
    }
        
    
    flexSize(selector) {
        let ele = $(selector);
        ele.css({
            'height': 'auto',
            'overflow-y': 'hidden'
        }).height(ele.prop('scrollHeight'));
    }

    inputHandler(e) {
        // const store = this.store
        this.state.info.code = e.target.value;
        this.setState({info:this.state.info});
        this.flexSize(e.target);

    }

    inputNameHandler(e){
        this.state.info.name = e.target.value;
        this.setState({info:this.state.info});
    }
    
    optionRun() {
        // console.log(this.props.store)
        // console.log("get here!!!")
        // console.log(this.state.info.code);
        
        this.run(this.state.info.code);
        // console.log(this.state.info.output);
        // console.log(store.state.output);
       
    }
    
    optionSave() {
        if (typeof this.state.info.id == 'string') {
            this.create(false)
           
        } else {
            this.update(this.state.info.id, false)
        }
    }
    optionUpdate() {
        if (typeof this.state.info.id == 'string') {
            this.create(true)
        } else {
            this.update(this.state.info.id, true)
        }
    }
    optionNewOptions() {
        this.state.info.name = '';
        this.state.info.code = '';
        this.state.info.id = '';
        this.state.info.output = '';
        this.setState({info:this.state.info});
    }
    
    // listGetDetail(id) {
    //     this.getDetail(id)
    // }
    // listRun(id) {
    // Rstore.actions.runDetail(id)
    // }
    // listRemove(id) {
    //     store.actions.remove(id)
    // }

    render() {
        return (
            <div className="continer-fluid">
                <div className="row text-center h1">
                    Online Python Interpreter
                </div>
                <hr/>
                <div className="row">
                    <div className="col-md-3">
                        <List info = {this.state.info}
                            run = {(id)=>this.runDetail(id)}
                            getDetail = {(id)=>this.getDetail(id)} 
                            remove = {(id)=>this.remove(id)}
                            >
                        </List>
                    </div>
                    <div className="col-md-9">
                        <div className="container-fluid">
                            <div className="col-md-6">
                                <p className="text-center h3">Input code below:</p>
                                <Input
                                    info = {this.state.info}
                                    inputHandler = {(e)=>this.inputHandler(e)}
                                    inputNameHandler = {(e)=>this.inputNameHandler(e)}>
                                </Input>
                                <hr/>
                                <Options info = {this.state.info}
                                    run = {()=>this.optionRun()}
                                    save = {()=>this.optionSave()} 
                                    update = {()=>this.optionUpdate()}
                                    newOptions = {()=>this.optionNewOptions()}>
                                </Options>
                            </div>
                            <p className="text-center h3">Output</p>
                            <div className="col-md-6">
                                <Output 
									info = {this.state.info}
									onClick = {()=>this.handleClick()}>
								</Output>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
	<App />,
	document.getElementById('app')
);
