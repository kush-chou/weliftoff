package ai.substrata.liftoff.core.data

import android.content.Context
import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "colophon_records")
data class ColophonRecord(
    @PrimaryKey val id: String,
    val commitSha: String,
    val verifiedAtEpochMs: Long
)

@Dao
interface ColophonDao {
    @Query("SELECT * FROM colophon_records ORDER BY verifiedAtEpochMs DESC")
    fun observeRecords(): Flow<List<ColophonRecord>>

    @Upsert
    suspend fun upsertRecord(record: ColophonRecord)
}

@Database(entities = [ColophonRecord::class], version = 1, exportSchema = true)
abstract class AppDatabase : RoomDatabase() {
    abstract fun colophonDao(): ColophonDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "liftoff.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
