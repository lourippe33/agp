@@ .. @@
       </View>

       {/* Carrousel des jours */}
       <View style={styles.weekCarousel}>
         <View style={styles.weekHeader}>
           <TouchableOpacity 
             style={[styles.weekArrow, currentWeek === 0 && styles.weekArrowDisabled]}
             onPress={() => currentWeek > 0 && setCurrentWeek(currentWeek - 1)}
             disabled={currentWeek === 0}
           >
             <ChevronLeft size={20} color={currentWeek === 0 ? Colors.textSecondary : Colors.text} />
           </TouchableOpacity>
           
           <Text style={styles.weekTitle}>
             Semaine {currentWeek + 1} / 4
           </Text>
           
           <TouchableOpacity 
             style={[styles.weekArrow, currentWeek === 3 && styles.weekArrowDisabled]}
             onPress={() => currentWeek < 3 && setCurrentWeek(currentWeek + 1)}
             disabled={currentWeek === 3}
           >
             <ChevronRight size={20} color={currentWeek === 3 ? Colors.textSecondary : Colors.text} />
           </TouchableOpacity>
         </View>

         <ScrollView 
           horizontal 
           showsHorizontalScrollIndicator={false}
           contentContainerStyle={styles.daysContainer}
         >
           {weekDays.map((dayInfo) => {
             const isPast = dayInfo.programDay < currentDay;
             const isCurrent = dayInfo.programDay === currentDay;
             const isSelected = dayInfo.programDay === selectedDay;
             
             return (
               <TouchableOpacity
                 key={dayInfo.programDay}
                 style={[
                   styles.dayItem,
                   isPast && styles.pastDay,
                   isCurrent && styles.currentDay,
                   isSelected && styles.selectedDay,
                 ]}
                 onPress={() => router.push(`/programme/${dayInfo.programDay}`)}
               >
                 <Text style={[
                   styles.dayText,
                   isPast && styles.pastDayText,
                   isCurrent && styles.currentDayText,
                   isSelected && styles.selectedDayText,
                 ]}>
                   {dayInfo.dayName}
                 </Text>
                 <Text style={[
                   styles.dayNumber,
                   isPast && styles.pastDayNumber,
                   isCurrent && styles.currentDayNumber,
                   isSelected && styles.selectedDayNumber,
                 ]}>
                   {dayInfo.date}
                 </Text>
                 <Text style={styles.programDay}>
                   J{dayInfo.programDay}
                 </Text>
               </TouchableOpacity>
             );
           })}
         </ScrollView>
       </View>

       {/* Bouton temporaire pour tester l'incrémentation */}
       <View style={styles.content}>
         <TouchableOpacity style={styles.testButton} onPress={incrementDay}>
           <Text style={styles.testButtonText}>
             Valider le jour {currentDay} (Test)
           </Text>
         </TouchableOpacity>
       </View>
     </View>
   );
 }