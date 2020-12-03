import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';
 export default class PostSearchView extends BaseComponent {
  constructor(props) {
      super(props);
      this.state = {
          value: '',
          placeholder: 'please search here....',
          isPostList: false, 
          keyword: '', 
          searchHistory: [], 
          hotTagsArr: [], 
      };
  }
  componentDidMount() {
        this._getHotWords()
    }
   
  _getHotWords() {
    ModalIndicator.show('请求中...')
    let params = '{"data":{}}'
    this._post('../test.json', {},
        params, true, data => {
            ModalIndicator.hide()
            if (data.code == 0) {
                console.log('hotTagsArr: ' + data.data)
                console.log('hotTagsArr: ' + data.data.hot_words)
                if (!_.isEmpty(data.data.hot_words)) {
                    this.setState({
                        hotTagsArr: data.data.hot_words,
                    })
                } else {
                    this.setState({
                        hotTagsArr: [],
                    })
                }
            } else {
                _showModalMessage(this.props.navigation, data.msg);
            }
        }, err => {
            ModalIndicator.hide()
            console.log('err: ', err)
        })
    }

     
     onChanegeTextKeyword(Val) {
      let keys = {};
      //输入的关键字去空格空字符
      let newVal = Val.replace(/(^\s*)|(\s*$)/g, "")
      if (!_.isEmpty(newVal)) {
          keys = {
              keyword: newVal
          };
          this.setState({isPostList: true})
      } else {
          Toast.message('请输入搜索关键字', null, 'center')
      }
      this.setState({keyword: keys});
  } 

  
  _onFous(v) {
      if (v.nativeEvent.target) {
          this.setState({isPostList: false})
      }
  }
 
  _getHistory() {
      // 查询本地历史
      getItems("searchHistory").then(data => {
          if (data == null) {
              this.setState({
                  searchHistory: [],
              })
          } else {
              this.setState({
                  searchHistory: data,
              })
          }
      })
  }
 
  render() {
    return (
        <View style={styles.container}>
         
            <NavigationEvents onWillFocus={() => {
               
                this._getHistory();
            }}/>
            <Header title='搜索'
                    navigation={this.props.navigation}
                    show_close_img={true}
            />
            <View style={styles.inputBox}>
                
                <TextInput style={styles.inputText}
                           autoCapitalize="none"
                           value={this.state.value}
                           onChangeText={(text) => this.setState({value: text})}
                           onSubmitEditing={() => {
                              
                               this.onChanegeTextKeyword(this.state.value);
                               
                           }}
                           returnKeyType="search"
                           underlineColorAndroid="transparent"
                           placeholder={this.state.placeholder}
                           placeholderTextColor={'#BFBFBF'}
                           onFocus={this._onFous.bind(this)}
                           autoFocus={true}
                           defaultValue={this.state.value}
                           keyboardType="default"/>
            </View>
            <View style={styles.lin}/>
            {
                (this.state.isPostList) ?
                   
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.listView}>
                            <PostSearchList keyword={this.state.keyword}{...this.props}/>
                        </View>
                    </ScrollView>
                    :
                 
                    <ScrollView style={styles.scrollView}>
                      
                        {
                           
                        } 
                    </ScrollView>
            }
        </View>
    )
}

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
},
inputBox: {
    height: Platform.OS === 'ios' ? 25 : 35,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    borderRadius: 8,
    borderWidth: 0,
    marginTop: 10,
},
lin: {
    height: 1,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#f1f1f1',
    marginTop: 10,
},
scrollView: {},
listView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
},
head1: {
    paddingHorizontal: 16,
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
},
head: {
    paddingHorizontal: 16,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
},
queryList: {
    marginTop: 10,
    marginRight: 16,
    marginLeft: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "#fff"
},
queryItem: {
    flex: 1,
    fontSize: scale(12),
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 30,
    paddingVertical: 6,
    borderRadius: 3,
    marginRight: 10,
    marginBottom: 10
},
inputIcon: {
    margin: Platform.OS === 'ios'
        ? 5
        : 10
},
inputText: {
    flex: 1,
    paddingLeft: 5,
    textAlignVertical: 'center',
    paddingVertical: 0
},
noData: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 10,
    marginBottom: 12,
},
noDataTxt: {
    fontSize: scale(12),
},
});


