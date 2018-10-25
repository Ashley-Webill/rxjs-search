import React, { Component } from 'react';
import { View, TextInput, FlatList, Text} from 'react-native';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'; 
import { Subject } from 'rxjs';
import axios from 'axios';

const onSearch$ = new Subject().pipe(distinctUntilChanged(),
    debounceTime(1000)
);

class Search extends Component{
    constructor(props){
        super(props);
        this.state = {
            search: '',
            debounced: '',
            data: []
        };
    }

    componentDidMount(){
        this.subscription = onSearch$.subscribe(
            debounced => this.setState({ debounced }),
            axios.get('http://localhost:3000/posts/')
            .then((response) => {
                this.setState({data: response.data})
            })
            .catch((error) => {
                console.log(error);
            })
        );
        
      }
      
      componentWillUnmount() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
      }

    onSearch = (text) => {
        const search = text;
        this.setState({ search });
        onSearch$.next(search);
    }

    render(){
        console.log('debounced :', this.state.debounced); 
        return(
            <View style={{alignSelf: 'center', justifyContent: 'center'}}>
                <TextInput
                    placeholder={'Type here...'}
                    onChangeText={(text) => this.onSearch(text)}
                    value={this.state.search}
                />
                <View style={{alignSelf: 'center', justifyContent: 'center'}}>
                    <FlatList
                        data={this.state.data.filter(item => item.title.includes(this.state.debounced.toLowerCase()))}
                        renderItem={({item, index}) => 
                            <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>{item.title}</Text>
                                <Text>{item.author}</Text>
                            </View>
                        }
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </View>
        )
    }
}

export default Search;



