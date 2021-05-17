const opphealth = opponent.health;
const oppattack = opponent.attack;
const oppdefense = opponent.defense;
const health = instructor.health;
const attack = instructor.attack;
const defense = instructor.defense;

//when you click the tap
const onPress = () => {
  const damage = instructor.attack/ opponent.defence;
  opphealth = opphealth - damage;
  if (opphealth <= 0){
    return WINNER
  }
}
const oppATK = () => {
  let oppTPS = opplevel + 3;
  let dmg = (oppattack / defense) * oppTPS;
  const interval = setInterval(() => {
    health = health - dmg
  }, 1000);
  if(health <= 0){
    return FINCHAT
  }
}
if(WINNER){
  exp += 10
  if(exp >= maxexp){
    LEVELUP
  }
}
if(FINCHAT){
  exp -= 10
  if(exp <= minexp){
    LEVELDOWN
  }
}


