
// store all the app data in a big data structure
var data = {
    allItems: {
        inc: [],
        exp: []
    },
    total: {
        inc:0,
        exp:0,
    },
}

/*************
UI controller
**************/
var UICtrl = (function() {
    // create Income items
    var Incoms= function(id,type,des,val) {
        this.id = id;
        this.type = type;
        this.des = des;
        this.val = val;
        // display it in UI
        this.shaowItems = function() {
            // create icome item html and store put it's data in it
            itemInc = '<div class="item" id="inc-'+id+'"><div class="descrip">'+ des +'</div><div class="num"><div class="inc-num">'+ UICtrl.formatNum(val, 'inc') +'</div><button><i class="fa fa-times-circle-o fa-lg" aria-hidden="true"></i></button class="close"></div></div>';
            //put it in the dom tree
            document.querySelector('.budget-details .inc').insertAdjacentHTML('beforeend',itemInc);
        }
    };

    // create Expense items
    var Expense= function(id,type,des,val) {
        this.id = id;
        this.type = type;
        this.des = des;
        this.val = val;
        this.percentage = 0;

        // display it in UI
        this.shaowItems = function() {
            // create expense item html and store put it's data in it
            itemExp = '<div class="item" id="exp-'+id+'"><div class="descrip">'+ des +'</div><div class="num"><div class="exp-num">' + UICtrl.formatNum(val, 'exp') + '</div><div class="percentage">'+ this.percentage +'%'+'</div><button class="close"><i class="fa fa-times-circle-o fa-lg" aria-hidden="true"></i></button></div></div>';
            //put it in the dom tree
            document.querySelector('.budget-details .exp').insertAdjacentHTML('beforeend',itemExp);
        };

        //calclate percentage for every exp item
        this.calcPercent = function(totalIncome) {
            if(totalIncome > 0) {
                this.percentage = Math.round((this.val / totalIncome) * 100)
            } else {
                this.percentage = 0
            }
            return this.percentage;
        };
        
    };
    
    //loop throw any node List
    var nodListForEach = function(list, callback) {
        for( var i =0; i< list.length; i++) {
            callback(list[i], i)
        }
    }

    return {
        //get data from user
        getData: function() {
            return {
                type: document.querySelector('.budget-type').value,
                discrip: document.querySelector('.user-input .discrip').value,
                val: parseInt(document.querySelector('.user-input .val').value),
            }
        },
        
        //create items
        createItem: function(type,discrip,val) {
            //create a niqe ID for every item
            var ID;
            if(data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length -1].id +1;
            } else {
                ID =0
            }
            //create items depens on type
            if(type === 'inc') {
                var item = new Incoms(ID,type,discrip,val);
                item.shaowItems()
            } else if(type === 'exp') {
                var item = new Expense(ID,type,discrip,val);
                item.shaowItems()
            }
            // push items with all its data on its place in data structure depens on type
            data.allItems[type].push(item);
        },
        displayTotalBudget: function(type) {
            // display the total value for inc or exp
            if(type === 'inc') {
                document.querySelector('.budget .total-inc .inc-num').textContent =UICtrl.formatNum(data.total.inc, 'inc');
            } else if(type === 'exp') {
                document.querySelector('.budget .total-exp .exp-num').textContent =UICtrl.formatNum(data.total.exp, 'exp'); ;
            }
        },
        netBudget: function() {
            // calculate and display the Net of budget
            var netBudg = data.total.inc - data.total.exp;
            var type;
            netBudg > 0 ? type = 'inc' : type = 'exp';
            document.querySelector('.budget .total-budget').textContent = UICtrl.formatNum(netBudg, type);;
        },
        
        //turn inputs to be empty
        inputEmpty: function() {
            document.querySelector('.user-input .val').value = '';
            document.querySelector('.user-input .discrip').value = '';
            document.querySelector('.user-input .discrip').focus();
        },
        displayExpPercet: function() {
            //stroe the array which store new percentages
            var expPercentage = budgetCtrl.clacPercentage();
            //select the all exp item's percentage
            var fields = document.querySelectorAll('.item .percentage');
            
            //loop throw the exp item's percentage node list and change text content
            nodListForEach(fields, function(current, index) {
                current.textContent = expPercentage[index] + '%'
            });
        },
        displayTotalPercent: function() {
            var totalPer = budgetCtrl.calcTotalPercentage();
            document.querySelector('.budget .total-exp .num .percentage').textContent = Math.round(totalPer * 100) + '%'
        },
        targetDelItem: function() {
            var item, type, id, index, ids

            //target the exact item id you want to delete
            item = event.target.parentNode.parentNode.parentNode.id;

            //split the id to be (type / ID number) inc-0 >> inc / 0
            splitID = item.split('-') // inc-0 >> [inc, 0]
            type = splitID[0];
            id= parseFloat(splitID[1]);
            
            // create a new arry and store the item ids
            ids = data.allItems[type].map(function(cur) {
                return cur.id
            });
            //find the position of the item you want to delete in the ids array
            index = ids.indexOf(id);

            return {
                item, type, id, index, ids
            }
        },
        deleteItems: function() {
            console.log(UICtrl.targetDelItem())
            //use this position for delete this item from data structure
            data.allItems[UICtrl.targetDelItem().type].splice(UICtrl.targetDelItem().index, 1);
            //delete this item from UI
            var el = document.querySelector('#' + UICtrl.targetDelItem().item);
            el.parentNode.removeChild(el);
            
        },
        formatNum: function(num, type) {
            num = Math.abs(num);
            num = num.toFixed(2);
            numSpilt = num.split('.');
            int = numSpilt[0];

            if(int.length > 3) {
                int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
            }
            des = numSpilt[1];
            return (type === 'exp' ? '-' : '+') + ' ' + int+ '.' + des
        },
        displayDate: function() {
            now = new Date();
            year = now.getFullYear();
            month = now.getMonth();
            months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

            document.querySelector('.date').textContent = 'Available Budget in ' + months[month] + ' ' + year
            
        },
        changeColorInputs: function() {
            var fields = document.querySelectorAll('.user-input .budget-type' + ',' + '.user-input .discrip' + ',' + '.user-input .val');

            //loop throw the this node list and change text content
            nodListForEach(fields, function(current) {
                current.classList.toggle('red-inputs')
            });
            document.querySelector('.fa-check-circle-o ').classList.toggle('red')
            

        },
        
    }
})();

/****************
budget controller
*****************/
var budgetCtrl = (function() {
    
    
    
    return {
        calcTotalBudget: function(type) {
            //loop throw the items and sum the val to calc the total inc or total exp
            var sum=0;
            data.allItems[type].forEach(function(cur) {
                sum+= cur.val;
            });

            //store the total value for inc or exp in the data structure
            data.total[type] = sum
        },
        //loop on the exp items and calclate its percentage and stroe the new percentages in a new array
        clacPercentage: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.calcPercent(data.total.inc)
            })
            return allPerc
        },
        calcTotalPercentage: function() {
            if(data.total.inc > 0) {
                return data.total.exp / data.total.inc
            } else {
                return 0;
            }
            
        }
        
    }

})();

/****************
app controller
*****************/

var appCtrl = (function(budget, UI) {
    
    // when the user fill inputs and click submit
    document.querySelector('.submit').addEventListener('click', function() {
        //get data from UI module to be easy to use it
        var type, discrip, val;
        type = UICtrl.getData().type;
        discrip = UICtrl.getData().discrip;
        val = UICtrl.getData().val;

        if(discrip !=='' && val > 0) {
            //create new item
            UICtrl.createItem(type, discrip, val);

            //calclate and display total budget
            budgetCtrl.calcTotalBudget(type);
            UICtrl.displayTotalBudget(type);

            // calculate and display the Net of budget
            UICtrl.netBudget();

            //turn inputs to be empty
            UICtrl.inputEmpty()

            //calaclate and display Exp Persentage
            UICtrl.displayExpPercet()

            //calaclate and display total Exp Persentage
            UICtrl.displayTotalPercent()
        }
    });
    document.addEventListener('keypress', function(e) {
        if(e.keyCode === 13 || e.which === 13) {
            //get data from UI module to be easy to use it
            var type, discrip, val;
            type = UICtrl.getData().type;
            discrip = UICtrl.getData().discrip;
            val = UICtrl.getData().val;

            if(discrip !=='' && val > 0) {
                //create new item
                UICtrl.createItem(type, discrip, val);

                //calclate and display total budget
                budgetCtrl.calcTotalBudget(type);
                UICtrl.displayTotalBudget(type);

                // calculate and display the Net of budget
                UICtrl.netBudget();

                //turn inputs to be empty
                UICtrl.inputEmpty()

                //calaclate and display Exp Persentage
                UICtrl.displayExpPercet()

                //calaclate and display total Exp Persentage
                UICtrl.displayTotalPercent()
            }
        }
    });

    //when you want to delete item
    document.querySelector('.budget-details').addEventListener('click', function(event) {
        var type = UICtrl.targetDelItem().type;

        //delete Item
        UICtrl.deleteItems()

        //calclate and display total budget
        budgetCtrl.calcTotalBudget(type);
        UICtrl.displayTotalBudget(type);

        // calculate and display the Net of budget
        UICtrl.netBudget();

        //calaclate and display Exp Persentage
        UICtrl.displayExpPercet()

        //calaclate and display total Exp Persentage
        UICtrl.displayTotalPercent()

        
        
        
    });

    //change inputs color based on type
    document.querySelector('.budget-type').addEventListener('change', UICtrl.changeColorInputs)


    return {
        init: function() {
            document.querySelector('.budget .total-inc .inc-num').textContent = 0;
            document.querySelector('.budget .total-exp .exp-num').textContent = 0;
            document.querySelector('.budget .total-exp .num .percentage').textContent = '--';
            document.querySelector('.budget .total-budget').textContent = 0;
            UICtrl.displayDate()
            
        }
    }
})(budgetCtrl, UICtrl);

appCtrl.init();


